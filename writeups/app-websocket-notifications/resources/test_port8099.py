"""Synthetic loopback checks for the port-8099 Python package.

Run with the package installed or network-services/port-8099/src on PYTHONPATH.
"""

import base64
from contextlib import contextmanager, redirect_stdout
import hashlib
import io
import json
from queue import Queue
import socket
import struct
from threading import Thread
import unittest
from unittest.mock import patch

from beacon8099 import AuthenticationError, Beacon8099, Beacon8099Error
from beacon8099.cli import main


ACCOUNT = "fixture-admin"
PASSWORD = "fixture:password"
INVENTORY = '{"event":"AllDeviceInfo","version":"6.1","payload":[]}'
TOPOLOGY = '{"event":"MeshNetwork","version":"6.1","aps":[],"links":[]}'


def read_exact(reader, size):
    data = reader.read(size)
    if len(data) != size:
        raise AssertionError("Fixture received a truncated message")
    return data


def read_frame(reader):
    first, length = read_exact(reader, 2)
    if not length & 0x80:
        raise AssertionError("Client frame was not masked")
    length &= 0x7F
    if length == 126:
        length = struct.unpack("!H", read_exact(reader, 2))[0]
    elif length == 127:
        length = struct.unpack("!Q", read_exact(reader, 8))[0]
    mask = read_exact(reader, 4)
    data = read_exact(reader, length)
    return first & 15, bytes(value ^ mask[index % 4] for index, value in enumerate(data))


def send_frame(conn, text, opcode=1):
    data = text.encode("utf-8") if isinstance(text, str) else text
    length = bytes([len(data)]) if len(data) < 126 else b"\x7e" + struct.pack("!H", len(data))
    conn.sendall(bytes([0x80 | opcode]) + length + data)


def handshake(conn, reader, chat=False):
    assert reader.readline() == b"GET / HTTP/1.1\r\n"
    headers = {}
    for line in iter(reader.readline, b"\r\n"):
        key, value = line.decode("ascii").split(":", 1)
        headers[key.lower()] = value.strip()
    assert headers["sec-websocket-version"] == "13"
    assert headers.get("sec-websocket-protocol") == ("chat" if chat else None)
    accept = base64.b64encode(hashlib.sha1((headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode("ascii")).digest())
    # Header shape of the original pre-auth G6 response. The accept is generated per request.
    response = b"HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + accept + b"\r\n"
    if chat:
        response += b"Sec-WebSocket-Protocol: chat\r\n"
    conn.sendall(response + b"\r\n")
    opcode, login = read_frame(reader)
    assert opcode == 1
    assert base64.b64decode(login, validate=True) == b"fixture-admin:fixture:password"


@contextmanager
def fixture(handler):
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        listener.listen()
        listener.settimeout(4)
        result = Queue()

        def serve():
            try:
                conn, _ = listener.accept()
                with conn, conn.makefile("rb") as reader:
                    conn.settimeout(4)
                    handler(conn, reader)
            except Exception as exc:
                result.put(exc)
            else:
                result.put(None)

        thread = Thread(target=serve, daemon=True)
        thread.start()
        try:
            yield listener.getsockname()[1]
        finally:
            thread.join(6)
            if thread.is_alive():
                raise AssertionError("Loopback fixture did not finish")
            error = result.get_nowait()
            if error is not None:
                raise error


def finish(conn, reader):
    assert read_frame(reader)[0] == 8
    send_frame(conn, b"\x03\xe8", opcode=8)


class Port8099Tests(unittest.TestCase):
    def test_receive_early_events_timeout_echo_and_close(self):
        future = json.dumps({"event": "FutureEvent", "fields": ["17", 17, True, None], "extension": "x" * 200})

        def handler(conn, reader):
            handshake(conn, reader)
            send_frame(conn, INVENTORY)
            send_frame(conn, "200 OK")
            send_frame(conn, future)
            assert read_frame(reader) == (1, b"echo check")
            send_frame(conn, TOPOLOGY)
            send_frame(conn, "echo check")
            send_frame(conn, b"\x03\xe8", opcode=8)
            assert read_frame(reader)[0] == 8

        with fixture(handler) as port, Beacon8099.connect("127.0.0.1", ACCOUNT, PASSWORD, port=port) as client:
            self.assertEqual(client.receive(1).text, INVENTORY)
            extra = client.receive(1)
            self.assertEqual(extra.text, future)
            self.assertEqual(extra.data["fields"], ["17", 17, True, None])
            with self.assertRaises(TimeoutError):
                client.receive(0.05)
            client.send_text("echo check")
            self.assertEqual([message.text for message in client], [TOPOLOGY, "echo check"])

    def test_negotiated_chat_sends_and_receives_text(self):
        def handler(conn, reader):
            handshake(conn, reader, chat=True)
            send_frame(conn, "200 OK")
            assert read_frame(reader) == (1, "chat text".encode())
            send_frame(conn, "text from another peer")
            finish(conn, reader)

        with fixture(handler) as port, Beacon8099.connect("127.0.0.1", ACCOUNT, PASSWORD, port=port, mode="chat") as client:
            client.send_text("chat text")
            self.assertEqual(client.receive(1).text, "text from another peer")

    def test_rejection_reports_status_without_retry(self):
        def handler(conn, reader):
            handshake(conn, reader)
            send_frame(conn, "401 Unauthorized")
            finish(conn, reader)

        with fixture(handler) as port, self.assertRaises(AuthenticationError) as raised:
            Beacon8099.connect("127.0.0.1", ACCOUNT, PASSWORD, port=port)
        self.assertEqual(raised.exception.status, 401)
        self.assertNotIn(PASSWORD, str(raised.exception))

    def test_http_redirect_is_closed_before_credentials(self):
        def handler(conn, reader):
            for line in iter(reader.readline, b"\r\n"):
                assert line
            conn.sendall(b"HTTP/1.1 302 Found\r\nLocation: ws://127.0.0.1:1/\r\nContent-Length: 0\r\n\r\n")
            assert reader.read(1) == b""

        with fixture(handler) as port, self.assertRaisesRegex(Beacon8099Error, "upgrade"):
            Beacon8099.connect("127.0.0.1", ACCOUNT, PASSWORD, port=port)

    def test_cli_filters_notifications_after_prompt(self):
        def handler(conn, reader):
            handshake(conn, reader)
            send_frame(conn, "200 OK")
            send_frame(conn, INVENTORY)
            send_frame(conn, TOPOLOGY)
            finish(conn, reader)

        stdout = io.StringIO()
        with fixture(handler) as port, patch("beacon8099.cli.getpass", return_value=PASSWORD), redirect_stdout(stdout):
            status = main(["127.0.0.1", ACCOUNT, "--port", str(port), "listen", "--event", "MeshNetwork", "--count", "1"])
        self.assertEqual(status, 0)
        self.assertEqual([json.loads(line) for line in stdout.getvalue().splitlines()], [json.loads(TOPOLOGY)])


if __name__ == "__main__":
    unittest.main(verbosity=2)
