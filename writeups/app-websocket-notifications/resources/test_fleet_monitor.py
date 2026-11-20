"""Fleet observation tests with mocked feeds and independent loopback routers."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest
import threading

from beacon8099 import AuthenticationError, Beacon8099, Beacon8099Error, Message
from test_port8099 import INVENTORY, PASSWORD, TOPOLOGY, fixture, handshake, send_frame


spec = spec_from_file_location("fleet_monitor", Path(__file__).with_name("fleet-monitor.py"))
monitor = module_from_spec(spec)
spec.loader.exec_module(monitor)


class Stop:
    def __init__(self):
        self.waits = []
        self.stopped = False

    def is_set(self):
        return self.stopped

    def wait(self, seconds):
        self.waits.append(seconds)


class Client:
    def __init__(self, *items):
        self.items = iter(items)

    def __enter__(self):
        return self

    def __exit__(self, *_):
        pass

    def receive(self, *, timeout):
        item = next(self.items)
        if isinstance(item, Exception):
            raise item
        return item


class FleetTests(unittest.TestCase):
    def run_feed(self, connections, stop_after=None, include_payload=False):
        stop = Stop()
        records = []
        queue = iter(connections)

        def connect(*args, **kwargs):
            item = next(queue)
            if isinstance(item, Exception):
                raise item
            return item

        def emit(alias, kind, **fields):
            self.assertEqual(alias, "G6-LAB")
            records.append((kind, fields))
            if len(records) == stop_after:
                stop.stopped = True

        monitor.observe("G6-LAB", "127.0.0.1", "fixture", "unused", stop, emit,
                        include_payload, connect=connect, delay=lambda low, high: high)
        return records, stop.waits

    def test_quiet_period_and_reconnect(self):
        records, waits = self.run_feed([
            Client(TimeoutError(), Message.from_text("text"),
                   Message.from_text(TOPOLOGY), Beacon8099Error("closed")),
            Client(Message.from_text(INVENTORY)),
        ], stop_after=5, include_payload=True)
        self.assertEqual([kind for kind, _ in records],
                         ["connected", "notification", "disconnected", "connected", "notification"])
        self.assertEqual([fields["generation"] for _, fields in records], [1, 1, 1, 2, 2])
        self.assertTrue(records[2][1]["snapshot_required"])
        self.assertEqual(records[1][1]["data"]["aps"], [])
        self.assertEqual(waits, [5])

    def test_refused_account_stops(self):
        records, waits = self.run_feed([AuthenticationError("refused", 401)])
        self.assertEqual(records, [("authentication_stopped", {"status": 401, "snapshot_required": True})])
        self.assertFalse(waits)

    def test_client_limit_and_backoff(self):
        update = Message.from_text('{"event":"DeviceStatusUpdate","payload":[{"private":"value"}]}')
        records, waits = self.run_feed([
            AuthenticationError("busy", 509), Beacon8099Error("offline"), Client(update),
        ], stop_after=4)
        self.assertEqual(waits, [5, 10])
        self.assertEqual(records[-1][1], {"generation": 1, "event": "DeviceStatusUpdate"})

    def test_distinct_loopback_feeds_keep_aliases(self):
        def make_server(text):
            def server(conn, reader):
                handshake(conn, reader)
                send_frame(conn, "200 OK")
                send_frame(conn, text)
                send_frame(conn, b"\x03\xe8", opcode=8)
                self.assertTrue(reader.read(1))
            return server

        records = {}
        with fixture(make_server(INVENTORY)) as first, fixture(make_server(TOPOLOGY)) as second:
            def run(alias, port):
                stop = threading.Event()
                seen = []

                def connect(host, user, password, *, timeout):
                    return Beacon8099.connect(host, user, password, port=port, timeout=timeout)

                def emit(alias, kind, **fields):
                    seen.append((alias, kind, fields))
                    if kind == "disconnected":
                        stop.set()

                monitor.observe(alias, "127.0.0.1", "fixture-admin", PASSWORD, stop, emit,
                                False, connect=connect)
                records[alias] = seen

            threads = [threading.Thread(target=run, args=(alias, port), daemon=True)
                       for alias, port in (("G6-A", first), ("G6-B", second))]
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join(5)
                self.assertFalse(thread.is_alive())

        for alias, event in (("G6-A", "AllDeviceInfo"), ("G6-B", "MeshNetwork")):
            self.assertEqual([row[0] for row in records[alias]], [alias] * 3)
            self.assertEqual([row[1] for row in records[alias]], ["connected", "notification", "disconnected"])
            self.assertEqual(records[alias][1][2], {"generation": 1, "event": event})


if __name__ == "__main__":
    unittest.main(verbosity=2)
