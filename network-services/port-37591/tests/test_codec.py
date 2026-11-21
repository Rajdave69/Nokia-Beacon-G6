import json
from pathlib import Path
import struct
import unittest
from beacon_mesh37591 import Message, Kind, FrameDecoder, encode_frame, FrameError, ProtocolError, Envelope, Heartbeat, heartbeat_ack, parse_heartbeat_ack
from beacon_mesh37591.codec import MAGIC

FIXTURES = Path(__file__).parent / "fixtures"

class NativeOracleTests(unittest.TestCase):
    def test_all_vendor_vectors_are_lossless_in_both_directions(self):
        total = 0
        for path in sorted(FIXTURES.glob("*-native-vectors.json")):
            data = json.loads(path.read_text())
            self.assertEqual(len(data["vectors"]), 7)
            for item in data["vectors"]:
                with self.subTest(profile=data["profile"], message=item["name"]):
                    raw = bytes.fromhex(item["record_hex"])
                    frame = bytes.fromhex(item["frame_hex"])
                    msg = Message.from_record(raw)
                    self.assertEqual(msg.kind.native_type, item["kind"])
                    self.assertEqual(msg.sequence, item["sequence"])
                    self.assertEqual(msg.url, item["url"])
                    self.assertEqual(msg.payload, bytes.fromhex(item["payload_hex"]))
                    self.assertEqual(len(msg.payload), item["payload_length"])
                    self.assertEqual(msg.to_record(), raw)
                    self.assertEqual(msg.to_frame(), frame)
                    decoder = FrameDecoder()
                    self.assertEqual(decoder.feed(frame), [raw])
                    decoder.finish()
                    total += 1
        self.assertEqual(total, 14)

    def test_non_json_heartbeat_matches_vendor_bytes(self):
        vectors = json.loads((FIXTURES / "hjl-native-vectors.json").read_text())["vectors"]
        hb = next(x for x in vectors if x["name"] == "heartbeat")
        raw = bytes.fromhex(hb["payload_hex"])
        self.assertEqual(Heartbeat(9, 12000, 4).to_payload(), raw)
        self.assertEqual(Heartbeat.from_payload(raw), Heartbeat(9, 12000, 4))
        ack = next(x for x in vectors if x["name"] == "heartbeat_ack")
        self.assertEqual(heartbeat_ack(9), bytes.fromhex(ack["payload_hex"]))
        self.assertEqual(parse_heartbeat_ack(bytes.fromhex(ack["payload_hex"])), 9)
        with self.assertRaises(ValueError):
            json.loads(raw[:-1])

    def test_envelope_sequence_is_distinct_from_transport_sequence(self):
        item = next(x for x in json.loads((FIXTURES / "hjl-native-vectors.json").read_text())["vectors"] if x["name"] == "request")
        msg = Message.from_record(bytes.fromhex(item["record_hex"]))
        self.assertEqual(msg.sequence, 44)
        self.assertEqual(msg.application().sequence, 1)
        self.assertEqual(msg.application().to_payload(), msg.payload)

class StreamTests(unittest.TestCase):
    def setUp(self):
        self.records = [Message(i, Kind.REQUEST, "tcp://192.0.2.10:37592", b'{"x":1}\0').to_record() for i in range(4)]
        self.wire = b"".join(encode_frame(x) for x in self.records)

    def test_every_byte_can_arrive_separately(self):
        decoder = FrameDecoder()
        result = []
        for byte in self.wire:
            result.extend(decoder.feed(bytes([byte])))
        decoder.finish()
        self.assertEqual(result, self.records)

    def test_coalesced_frames_and_every_two_chunk_split(self):
        for split in range(len(self.wire) + 1):
            decoder = FrameDecoder()
            result = decoder.feed(self.wire[:split]) + decoder.feed(self.wire[split:])
            decoder.finish()
            self.assertEqual(result, self.records)

    def test_vendor_padding_is_ignored_but_terminator_is_required(self):
        frame = bytearray(encode_frame(self.records[0]))
        frame[15:32] = b"X" * 17
        self.assertEqual(FrameDecoder().feed(frame), self.records[:1])
        frame[14] = ord("X")
        with self.assertRaises(FrameError):
            FrameDecoder().feed(frame)

    def test_limit_is_checked_before_body_arrives(self):
        for length in (0, 65537, 0xffffffff):
            header = MAGIC + bytes(32-len(MAGIC)) + struct.pack("!I", length)
            with self.assertRaises(FrameError):
                FrameDecoder().feed(header)
        record = b"X" * 65536
        self.assertEqual(FrameDecoder().feed(encode_frame(record)), [record])
        with self.assertRaises(FrameError):
            encode_frame(record + b"X")
        self.assertEqual(FrameDecoder(max_record_size=131072).feed(encode_frame(record+b"X", max_record_size=131072)), [record+b"X"])

    def test_eof_detects_partial_header_and_payload(self):
        frame = encode_frame(self.records[0])
        for split in (1, 35, 36, len(frame)-1):
            decoder = FrameDecoder()
            decoder.feed(frame[:split])
            with self.assertRaises(FrameError):
                decoder.finish()

    def test_raw_payload_termination_and_bytes_are_preserved(self):
        for payload in (b"abc", b"abc\0", b"a\0b\0", "caf\u00e9".encode()):
            msg = Message(0, Kind.REQUEST, "tcp://192.0.2.10:37592", payload)
            self.assertEqual(Message.from_record(msg.to_record()), msg)

    def test_bad_record_lines_are_rejected(self):
        for raw in [b"", b"-\nnokia_memsmsg_login\nx", b"1\nnokia_memsmsg_payload\ntcp://x:1\nnokia_memsmsg_payload\nx", b"x\nnokia_memsmsg_login\ntcp://x:1\nnokia_memsmsg_payload\nx"]:
            with self.assertRaises(ProtocolError):
                Message.from_record(raw)
        with self.assertRaises(ProtocolError):
            Message(0, Kind.LOGIN, "tcp://x:1\ninjected", b"x")
        with self.assertRaises(ProtocolError):
            Message(True, Kind.LOGIN, "tcp://x:1", b"x")

class LiveCompatibilityTests(unittest.TestCase):
    def test_empty_record_url_preserved_without_allowing_empty_login_identity(self):
        from beacon_mesh37591.codec import validate_url
        # Ordinary first controller request observed after a valid login.
        record = b'0\nnokia_memsmsg_request\n\nnokia_memsmsg_payload\n{"type":"AI","sequence":1,"mac":"00:00:00:00:00:00","version":"1.0.0","ai-meshmsg-data":{"action_type":12,"enable":1}}\x00'
        decoded = Message.from_record(record)
        self.assertEqual(decoded.url, "")
        self.assertEqual(decoded.application().data, {"action_type": 12, "enable": 1})
        self.assertEqual(decoded.to_record(), record)
        with self.assertRaises(ProtocolError):
            validate_url("")
