import socket
import threading
import unittest
from unittest.mock import patch
from beacon_mesh37591 import MeshConnection, ControllerServer, connect_controller, Role, Kind, Message, FrameDecoder, Envelope, Heartbeat, heartbeat_ack, parse_heartbeat_ack, scan_enabled, ApplicationError, FrameError, ConnectionClosed, ReceiveTimeout, HeartbeatTimeout

class ConnectionTests(unittest.TestCase):
    def make_pair(self, **kwargs):
        a, b = socket.socketpair()
        self.addCleanup(a.close)
        self.addCleanup(b.close)
        peer = MeshConnection(a, role=Role.CONTROLLER, local_url="tcp://127.0.0.1:37591", auto_heartbeat=False, **kwargs)
        self.addCleanup(peer.close)
        return peer, b

    def test_timeout_retains_partial_frame(self):
        peer, wire = self.make_pair()
        message = Message(0, Kind.LOGIN, "tcp://192.0.2.10:37592", b"tcp://192.0.2.10:37592\0")
        frame = message.to_frame()
        wire.sendall(frame[:10])
        with self.assertRaises(ReceiveTimeout):
            peer.receive(timeout=0.02)
        wire.sendall(frame[10:])
        self.assertEqual(peer.receive(timeout=1), message)
        self.assertEqual(peer.peer_url, "tcp://192.0.2.10:37592")

    def test_eof_in_partial_frame_closes_connection(self):
        peer, wire = self.make_pair()
        wire.sendall(b"TCP_")
        wire.close()
        with self.assertRaises(FrameError):
            peer.receive(timeout=1)
        self.assertTrue(peer.closed)

    def test_directions_fail_before_any_write(self):
        peer, wire = self.make_pair()
        with self.assertRaises(ApplicationError):
            peer.send_report({"request_type": 5})
        wire.settimeout(0.02)
        with self.assertRaises(socket.timeout):
            wire.recv(1)
        a, b = socket.socketpair()
        self.addCleanup(b.close)
        agent = MeshConnection(a, role=Role.AGENT, local_url="tcp://127.0.0.1:43210", auto_heartbeat=False)
        self.addCleanup(agent.close)
        with self.assertRaises(ApplicationError):
            agent.send_action(scan_enabled(False))

    def test_heartbeat_auto_ack_is_exact(self):
        a, b = socket.socketpair()
        self.addCleanup(b.close)
        peer = MeshConnection(a, role=Role.AGENT, local_url="tcp://127.0.0.1:43210", heartbeat_interval=100)
        self.addCleanup(peer.close)
        message = Message(9, Kind.HEARTBEAT, "tcp://127.0.0.1:37591", Heartbeat(7, 12000, 4).to_payload())
        b.sendall(message.to_frame())
        self.assertEqual(peer.receive(timeout=1), message)
        b.settimeout(1)
        frames = FrameDecoder().feed(b.recv(4096))
        ack = Message.from_record(frames[0])
        self.assertEqual(ack.kind, Kind.HEARTBEAT_ACK)
        self.assertEqual(parse_heartbeat_ack(ack.payload), 7)

    def test_unacknowledged_heartbeat_has_bounded_lifetime(self):
        a, b = socket.socketpair()
        self.addCleanup(b.close)
        peer = MeshConnection(a, role=Role.AGENT, local_url="tcp://127.0.0.1:43210", heartbeat_interval=0.02, heartbeat_count=1)
        self.addCleanup(peer.close)
        with self.assertRaises(HeartbeatTimeout):
            peer.receive(timeout=3)
        self.assertTrue(peer.closed)

    def test_loopback_login_reports_actions_and_reply_records(self):
        with ControllerServer(port=0, auto_heartbeat=False) as server:
            with connect_controller(*server.address, auto_heartbeat=False) as agent:
                with server.accept() as controller:
                    login = controller.receive(timeout=1)
                    self.assertEqual(login.kind, Kind.LOGIN)
                    self.assertEqual(controller.peer_url, agent.local_url)
                    self.assertNotEqual(agent.local_url, controller.local_url)
                    agent.send_report({"request_type": 5, "message": "loopback fixture"})
                    self.assertEqual(controller.receive(timeout=1).application().data["request_type"], 5)
                    controller.send_action(scan_enabled(False))
                    self.assertEqual(agent.receive(timeout=1).application().data, scan_enabled(False))
                    controller.send_envelope(Envelope({"result": "opaque reply"}), kind=Kind.REPLY, sequence=12)
                    reply = agent.receive(timeout=1)
                    self.assertEqual(reply.kind, Kind.REPLY)
                    self.assertEqual(reply.sequence, 12)

    def test_broadcast_reaches_each_connected_peer(self):
        with ControllerServer(port=0, auto_heartbeat=False) as server:
            with connect_controller(*server.address, auto_heartbeat=False) as first, connect_controller(*server.address, auto_heartbeat=False) as second:
                a = server.accept()
                b = server.accept()
                a.receive(timeout=1)
                b.receive(timeout=1)
                result = server.broadcast_action(scan_enabled(True))
                self.assertEqual(len(result), 2)
                self.assertTrue(all(isinstance(item[1], Message) for item in result))
                self.assertEqual(first.receive(timeout=1).application().data, scan_enabled(True))
                self.assertEqual(second.receive(timeout=1).application().data, scan_enabled(True))

    def test_invalid_configuration_does_not_resolve_or_connect(self):
        with patch("socket.getaddrinfo") as lookup:
            for kwargs in [{"profile": "typo"}, {"port": 0}, {"heartbeat_count": 0}, {"heartbeat_interval": float("inf")}, {"advertised_url": "tcp://bad\nidentity"}]:
                with self.assertRaises(ValueError):
                    connect_controller("unused.invalid", **kwargs)
            lookup.assert_not_called()

    def test_concurrent_senders_do_not_interleave_frames(self):
        a, b = socket.socketpair()
        self.addCleanup(b.close)
        peer = MeshConnection(a, role=Role.AGENT, local_url="tcp://127.0.0.1:43210", auto_heartbeat=False)
        failures = []
        def writer(n):
            try:
                for j in range(5):
                    peer.send_message(Kind.REQUEST, f"{n}:{j}".encode() + b"X"*1024)
            except Exception as exc:
                failures.append(exc)
        threads = [threading.Thread(target=writer, args=(i,)) for i in range(3)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join(3)
            self.assertFalse(thread.is_alive())
        peer.close()
        self.assertEqual(failures, [])
        decoder = FrameDecoder()
        records = []
        while chunk := b.recv(65536):
            records.extend(decoder.feed(chunk))
        decoder.finish()
        self.assertEqual(len(records), 15)
        self.assertEqual({Message.from_record(x).payload[:3] for x in records}, {f"{i}:{j}".encode() for i in range(3) for j in range(5)})
