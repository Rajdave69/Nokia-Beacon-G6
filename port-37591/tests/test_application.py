import unittest
from beacon_mesh37591 import Envelope, ScanConfiguration, scan_enabled, arm_scan_state, ApplicationError
from beacon_mesh37591.application import validate_action, validate_report

class ApplicationTests(unittest.TestCase):
    def test_unknown_fields_and_utf8_round_trip(self):
        envelope = Envelope({"request_type": 5, "label": "caf\u00e9", "nested": {"future": [1, None, True]}}, mac="02:00:00:00:00:10", extra={"future_header": 9})
        self.assertEqual(Envelope.from_payload(envelope.to_payload()), envelope)
        self.assertEqual(Envelope.from_payload(envelope.to_payload(nul_terminated=False)), envelope)
        self.assertIn(b"caf\xc3\xa9", envelope.to_payload())

    def test_duplicate_nonfinite_and_embedded_nul_are_rejected(self):
        for data in [b'{"type":"AI","type":"AI"}', b'{"x":NaN}', b'{}\0\0']:
            with self.assertRaises(ApplicationError):
                Envelope.from_payload(data)
        with self.assertRaises(ApplicationError):
            Envelope({"x": float("inf")})
        with self.assertRaises(ApplicationError):
            Envelope({"x": {1: "not a string key"}})
        mutable = Envelope({"request_type": 5})
        mutable.extra["type"] = "override"
        with self.assertRaises(ApplicationError):
            mutable.to_payload()

    def test_scan_helper_has_exact_required_keys_and_preserves_opaque_filters(self):
        config = ScanConfiguration(1, 0, 1, 0, 1, "1,6,11", "captured-filter", neighbor_scan_6=0)
        data = config.to_data()
        self.assertEqual(data, {"action_type": 0, "neighbor_scan_24": 1, "channel_survey_24": 0, "neighbor_scan_5": 1, "channel_survey_5": 0, "buddies_discover": 1, "channels": "1,6,11", "ssids": "captured-filter", "neighbor_scan_6": 0})
        validate_action(data)
        data.pop("ssids")
        with self.assertRaises(ApplicationError):
            validate_action(data)
        with self.assertRaises(ApplicationError):
            ScanConfiguration(0, 0, 0, 0, 0, "X"*50, "").to_data()
        with self.assertRaises(ApplicationError):
            ScanConfiguration(0, 0, 0, 0, 0, "", "\u00e9"*250).to_data()

    def test_known_action_codes_and_report_direction(self):
        self.assertEqual(scan_enabled(False), {"action_type": 12, "enable": 0})
        self.assertEqual(scan_enabled(True), {"action_type": 12, "enable": 1})
        self.assertEqual(arm_scan_state(), {"action_type": 13})
        for data in [scan_enabled(True), arm_scan_state()]:
            validate_action(data)
            with self.assertRaises(ApplicationError):
                validate_report(data)
        for code in (0, 5, 6, 7, 10):
            validate_report({"request_type": code})
        for code in (1, 2, 3, 4, 8, 9, 11):
            with self.assertRaises(ApplicationError):
                validate_report({"request_type": code})
        with self.assertRaises(ApplicationError):
            validate_action({"action_type": 11})
        with self.assertRaises(ApplicationError):
            scan_enabled(1)
        with self.assertRaises(ApplicationError):
            validate_action({"action_type": 12, "enable": True})

    def test_required_scan_values_cannot_be_null(self):
        from beacon_mesh37591.application import validate_action
        data = {"action_type": 0, "neighbor_scan_24": 1, "channel_survey_24": 1,
                "neighbor_scan_5": 1, "channel_survey_5": 1, "buddies_discover": 1,
                "channels": "", "ssids": ""}
        for key in ("neighbor_scan_24", "channel_survey_24", "neighbor_scan_5", "channel_survey_5", "buddies_discover"):
            with self.subTest(key=key), self.assertRaises(ApplicationError):
                validate_action({**data, key: None})
