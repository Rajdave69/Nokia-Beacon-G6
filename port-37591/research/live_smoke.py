#!/usr/bin/env python3
"""Explicit bounded router login/heartbeat/logout verification.

No application report or action is sent. Output captures can contain real
addresses and native header padding; select a private output directory.
Instrumentation is process-local and this tool starts no concurrent peers.
"""
from pathlib import Path
import argparse
from collections import Counter
import json
import time
from unittest.mock import patch
from beacon_mesh37591 import MeshConnection, FrameDecoder, connect_controller, Kind, ReceiveTimeout

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("host")
    ap.add_argument("--port", type=int, default=37591)
    ap.add_argument("--seconds", type=float, default=45)
    ap.add_argument("--output", type=Path, required=True, help="new private directory; captures include unredacted peer metadata")
    args = ap.parse_args()
    if not 1 <= args.seconds <= 120:
        ap.error("--seconds must be in 1..120")
    args.output.mkdir(parents=True, exist_ok=False)
    started = time.monotonic()
    events, chunks, records = [], [], []
    original_send, original_feed = MeshConnection.send_message, FrameDecoder.feed
    def record(direction, msg):
        row = {"seconds": round(time.monotonic()-started, 6), "direction": direction,
               "kind": msg.kind.value, "sequence": msg.sequence, "url": msg.url,
               "payload_hex": msg.payload.hex()}
        events.append(row)
        brief = {k: row[k] for k in ("seconds", "direction", "kind", "sequence")}
        brief["payload_bytes"] = len(msg.payload)
        if msg.kind in (Kind.REQUEST, Kind.REPLY):
            try:
                data = msg.application().data
                brief["inner_keys"] = list(data)
                brief["action_type"] = data.get("action_type")
            except ValueError:
                pass
        print(json.dumps(brief), flush=True)
    def sent(self, *a, **kw):
        msg = original_send(self, *a, **kw)
        record("tx", msg)
        return msg
    def capture(self, data):
        chunks.append(data)
        result = original_feed(self, data)
        records.extend(result)
        return result
    result = {"host": args.host, "port": args.port, "requested_duration_seconds": args.seconds,
              "profile": "common", "application_reports_sent": False, "scan_actions_sent": False,
              "events": events, "completed": False}
    peer = None
    try:
        with patch.object(MeshConnection, "send_message", sent), patch.object(FrameDecoder, "feed", capture):
            peer = connect_controller(args.host, args.port, timeout=5, profile="common")
            result["tcp_connected"] = True
            result["advertised_url"] = peer.local_url
            stop = time.monotonic() + args.seconds
            while time.monotonic() < stop:
                try:
                    msg = peer.receive(timeout=min(3, max(0.05, stop-time.monotonic())))
                except ReceiveTimeout:
                    continue
                record("rx", msg)
            peer.logout()
            result["logout_sent"] = True
        result["completed"] = True
    except Exception as exc:
        result.update(error_type=type(exc).__name__, error=str(exc))
        print(json.dumps({"error_type": type(exc).__name__, "error": str(exc)}), flush=True)
    finally:
        if peer:
            peer.close()
        result["elapsed_seconds"] = round(time.monotonic()-started, 6)
        result["records_hex"] = [row.hex() for row in records]
        result["counts"] = {d: dict(Counter(x["kind"] for x in events if x["direction"] == d)) for d in ("tx", "rx")}
        (args.output/"rx.bin").write_bytes(b"".join(chunks))
        (args.output/"session.json").write_text(json.dumps(result, indent=2)+"\n", encoding="utf-8")
        print(json.dumps({k: result[k] for k in ("completed", "elapsed_seconds", "counts")}), flush=True)
    return 0 if result["completed"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
