"""Typed known HJL actions and transparent application/report handling."""
from __future__ import annotations
from dataclasses import dataclass, field
import json
import math
import re
from typing import Any, Mapping
from .errors import ApplicationError

_MAC = re.compile(r"(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}\Z")
REPORT_TYPES = frozenset({0, 5, 6, 7, 10})
ACTION_TYPES = frozenset({0, 12, 13})

def _int(value: Any, name: str, *, minimum: int = -0x80000000) -> int:
    if type(value) is not int or not minimum <= value <= 0x7fffffff:
        raise ApplicationError(f"{name} must be an integer in [{minimum}, 2147483647]")
    return value

def _pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ApplicationError(f"duplicate JSON key: {key}")
        result[key] = value
    return result

def _reject_constant(value):
    raise ApplicationError(f"non-JSON number: {value}")

def _json_value(value: Any, depth: int = 0) -> None:
    if depth > 100:
        raise ApplicationError("JSON nesting exceeds the package limit of 100")
    if value is None or isinstance(value, (str, bool)):
        return
    if type(value) is int:
        return
    if type(value) is float and math.isfinite(value):
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ApplicationError("JSON object keys must be strings")
            _json_value(item, depth + 1)
        return
    if isinstance(value, list):
        for item in value:
            _json_value(item, depth + 1)
        return
    raise ApplicationError("value is not finite JSON data")

@dataclass(frozen=True, slots=True)
class Envelope:
    data: dict[str, Any]
    mac: str = "00:00:00:00:00:00"
    sequence: int = 1
    version: str = "1.0.0"
    type: str = "AI"
    extra: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        if not isinstance(self.data, dict) or not isinstance(self.extra, dict):
            raise ApplicationError("envelope data and extra must be JSON objects")
        if not isinstance(self.mac, str) or not _MAC.fullmatch(self.mac):
            raise ApplicationError("mac must have six colon-separated hexadecimal octets")
        _int(self.sequence, "envelope sequence")
        if not isinstance(self.version, str) or not isinstance(self.type, str):
            raise ApplicationError("version/type must be strings")
        if set(self.extra) & {"type", "sequence", "mac", "version", "ai-meshmsg-data"}:
            raise ApplicationError("extra fields overlap reserved envelope keys")
        _json_value(self.data)
        _json_value(self.extra)

    def to_dict(self) -> dict[str, Any]:
        return {"type": self.type, "sequence": self.sequence, "mac": self.mac, "version": self.version, **self.extra, "ai-meshmsg-data": self.data}

    def to_payload(self, *, nul_terminated: bool = True) -> bytes:
        self.__post_init__()
        if self.type != "AI" or self.version != "1.0.0":
            raise ApplicationError("encoding is supported for AI / 1.0.0 only")
        result = json.dumps(self.to_dict(), ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode("utf-8")
        return result + (b"\0" if nul_terminated else b"")

    @classmethod
    def from_payload(cls, payload: bytes) -> Envelope:
        raw = payload[:-1] if payload.endswith(b"\0") else payload
        if b"\0" in raw:
            raise ApplicationError("embedded NUL in JSON payload")
        try:
            value = json.loads(raw.decode("utf-8"), object_pairs_hook=_pairs, parse_constant=_reject_constant)
        except (UnicodeError, ValueError, RecursionError) as exc:
            raise ApplicationError("invalid UTF-8 JSON envelope") from exc
        if not isinstance(value, dict) or not {"type", "sequence", "mac", "version", "ai-meshmsg-data"} <= value.keys():
            raise ApplicationError("missing required AI envelope fields")
        extra = {k: v for k, v in value.items() if k not in {"type", "sequence", "mac", "version", "ai-meshmsg-data"}}
        return cls(value["ai-meshmsg-data"], value["mac"], value["sequence"], value["version"], value["type"], extra)

@dataclass(frozen=True, slots=True)
class Heartbeat:
    sequence: int
    interval: int
    count: int

    def to_payload(self) -> bytes:
        _int(self.sequence, "heartbeat sequence")
        _int(self.interval, "heartbeat interval", minimum=0)
        _int(self.count, "heartbeat count", minimum=0)
        return f"{{sequence:{self.sequence}}}, {{interval:{self.interval}}},{{count:{self.count}}}\0".encode("ascii")

    @classmethod
    def from_payload(cls, payload: bytes) -> Heartbeat:
        match = re.fullmatch(rb"\{sequence:(-?\d+)\}, \{interval:(\d+)\},\{count:(\d+)\}\x00?", payload)
        if not match:
            raise ApplicationError("invalid firmware heartbeat text (this is not JSON)")
        result = cls(*(int(x) for x in match.groups()))
        result.to_payload()
        return result

def heartbeat_ack(sequence: int) -> bytes:
    return f"{{sequence:{_int(sequence, 'heartbeat sequence')}}}\0".encode("ascii")

def parse_heartbeat_ack(payload: bytes) -> int:
    match = re.fullmatch(rb"\{sequence:(-?\d+)\}\x00?", payload)
    if not match:
        raise ApplicationError("invalid heartbeat-ack text")
    return _int(int(match[1]), "heartbeat sequence")

@dataclass(frozen=True, slots=True)
class ScanConfiguration:
    neighbor_scan_24: int
    channel_survey_24: int
    neighbor_scan_5: int
    channel_survey_5: int
    buddies_discover: int
    channels: str
    ssids: str
    neighbor_scan_6: int | None = None
    channel_survey_6: int | None = None

    def to_data(self) -> dict[str, Any]:
        result: dict[str, Any] = {"action_type": 0}
        for name in ("neighbor_scan_24", "channel_survey_24", "neighbor_scan_5", "channel_survey_5", "buddies_discover", "neighbor_scan_6", "channel_survey_6"):
            value = getattr(self, name)
            if value is not None or name not in ("neighbor_scan_6", "channel_survey_6"):
                result[name] = _int(value, name, minimum=0)
        for name, size in [("channels", 49), ("ssids", 499)]:
            value = getattr(self, name)
            if not isinstance(value, str) or "\0" in value or len(value.encode("utf-8")) > size:
                raise ApplicationError(f"{name} must fit {size} UTF-8 bytes without NUL")
            result[name] = value
        return result

def scan_enabled(enabled: bool) -> dict[str, int]:
    if type(enabled) is not bool:
        raise ApplicationError("enabled must be a bool")
    return {"action_type": 12, "enable": int(enabled)}

def arm_scan_state() -> dict[str, int]:
    """Action 13: set the observed state flag; complete scheduling is unresolved."""
    return {"action_type": 13}

def validate_report(data: Mapping[str, Any]) -> None:
    if not isinstance(data, dict):
        raise ApplicationError("report must be a JSON object")
    code = _int(data.get("request_type"), "request_type", minimum=0)
    if code not in REPORT_TYPES:
        raise ApplicationError("controller request_type must be 0, 5, 6, 7 or 10")
    _json_value(data)
    # This validates direction and JSON structure, not the complete RF schema.

def validate_action(data: Mapping[str, Any]) -> None:
    if not isinstance(data, dict):
        raise ApplicationError("action must be a JSON object")
    code = _int(data.get("action_type"), "action_type", minimum=0)
    if code not in ACTION_TYPES:
        raise ApplicationError("agent action_type must be 0, 12 or 13")
    if code == 0:
        try:
            known = {k: data[k] for k in ("neighbor_scan_24", "channel_survey_24", "neighbor_scan_5", "channel_survey_5", "buddies_discover", "channels", "ssids")}
        except KeyError as exc:
            raise ApplicationError(f"missing scan key {exc.args[0]}") from exc
        for name in ("neighbor_scan_6", "channel_survey_6"):
            if name in data:
                known[name] = data[name]
        ScanConfiguration(**known).to_data()
    elif code == 12 and (type(data.get("enable")) is not int or data["enable"] not in (0, 1)):
        raise ApplicationError("action 12 requires integer enable=0 or enable=1")
    _json_value(data)
