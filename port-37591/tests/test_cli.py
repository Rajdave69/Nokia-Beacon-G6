import contextlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from beacon_mesh37591 import HeartbeatTimeout, ConnectionClosed
from beacon_mesh37591 import cli

class CliTests(unittest.TestCase):
    def invoke(self, *args):
        stdout, stderr = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            status = cli.main(list(args))
        return status, stdout.getvalue(), stderr.getvalue()

    def test_native_heartbeat_encode_and_decode(self):
        fixture = json.loads((Path(__file__).parent / "fixtures/hjl-native-vectors.json").read_text())
        vector = next(x for x in fixture["vectors"] if x["name"] == "heartbeat")
        with tempfile.TemporaryDirectory() as d:
            target = str(Path(d)/"frame.bin")
            result = self.invoke("encode", "--kind", "heartbeat", "--url", vector["url"],
                                 "--sequence", str(vector["sequence"]), "--heartbeat-sequence", "9",
                                 "--interval", "12000", "--missed-count", "4", "--output", target)
            self.assertEqual(result[0], 0, result[2])
            self.assertEqual(Path(target).read_bytes().hex(), vector["frame_hex"])
            status, output, error = self.invoke("decode", target)
            self.assertEqual(status, 0, error)
            self.assertEqual(json.loads(output)["heartbeat"], {"sequence": 9, "interval": 12000, "count": 4})

    def test_concatenated_stdin_and_truncated_frame_error(self):
        fixture = json.loads((Path(__file__).parent / "fixtures/ijl-native-vectors.json").read_text())
        data = bytes.fromhex(fixture["vectors"][0]["frame_hex"])
        fake_stdin = io.TextIOWrapper(io.BytesIO(data+data), encoding="utf-8")
        with patch.object(sys, "stdin", fake_stdin):
            status, output, error = self.invoke("decode", "-")
        self.assertEqual(status, 0, error)
        self.assertEqual(len(output.splitlines()), 2)
        fake_stdin = io.TextIOWrapper(io.BytesIO(data[:-1]), encoding="utf-8")
        with patch.object(sys, "stdin", fake_stdin):
            status, output, error = self.invoke("decode", "-")
        self.assertEqual(status, 2)
        self.assertIn("mesh37591:", error)

    def test_invalid_application_rejected_before_connection_or_bind(self):
        with tempfile.TemporaryDirectory() as d:
            target = Path(d)/"invalid.json"
            target.write_text('{"request_type":999,"action_type":999}')
            with patch.object(cli, "connect_controller") as connect, patch.object(cli, "ControllerServer") as server:
                status, _, _ = self.invoke("send-report", "unused.invalid", "--json", str(target))
                self.assertEqual(status, 2)
                status, _, _ = self.invoke("serve", "--action", str(target))
                self.assertEqual(status, 2)
                connect.assert_not_called()
                server.assert_not_called()

    def test_heartbeat_expiry_is_an_error(self):
        with patch.object(cli, "connect_controller") as connect:
            connect.return_value.__enter__.return_value.receive.side_effect = HeartbeatTimeout("expired")
            status, _, error = self.invoke("watch", "unused.invalid")
            self.assertEqual(status, 2)
            self.assertIn("expired", error)
        with patch.object(cli, "connect_controller") as connect:
            connect.return_value.__enter__.return_value.receive.side_effect = ConnectionClosed("closed")
            self.assertEqual(self.invoke("watch", "unused.invalid")[0], 0)

    def test_import_has_no_socket_side_effect_and_module_help(self):
        code = "import socket; socket.socket = lambda *a, **k: (_ for _ in ()).throw(AssertionError('socket opened at import')); import beacon_mesh37591; import beacon_mesh37591.cli; print('imported')"
        imported = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=10)
        self.assertEqual(imported.returncode, 0, imported.stderr)
        self.assertEqual(imported.stdout.strip(), "imported")
        result = subprocess.run([sys.executable, "-m", "beacon_mesh37591", "--help"], capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("send-report", result.stdout)
