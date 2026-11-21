"""Offline encode/decode, explicit agent connection, and a small lab server."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import sys
from .codec import Kind, Message, FrameDecoder, record_limit
from .application import Envelope, Heartbeat, heartbeat_ack, validate_report, validate_action
from .connection import connect_controller, ControllerServer
from .errors import ProtocolError, ReceiveTimeout, ConnectionClosed, HeartbeatTimeout

def _read(path: str) -> bytes:
    return sys.stdin.buffer.read() if path == "-" else Path(path).read_bytes()

def _object(path: str) -> dict:
    value = json.loads(_read(path).decode("utf-8"))
    if not isinstance(value, dict):
        raise ValueError("application input must be a JSON object")
    return value

def _display(msg: Message) -> None:
    value = {"sequence": msg.sequence, "kind": msg.kind.value, "native_type": msg.kind.native_type,
             "url": msg.url, "payload_hex": msg.payload.hex()}
    if msg.kind in (Kind.REQUEST, Kind.REPLY):
        try:
            value["application"] = msg.application().to_dict()
        except ProtocolError as exc:
            value["application_error"] = str(exc)
    elif msg.kind == Kind.HEARTBEAT:
        hb = Heartbeat.from_payload(msg.payload)
        value["heartbeat"] = {"sequence": hb.sequence, "interval": hb.interval, "count": hb.count}
    print(json.dumps(value, ensure_ascii=True), flush=True)

def _loop(peer, count: int, timeout: float) -> None:
    n = 0
    while count == 0 or n < count:
        try:
            msg = peer.receive(timeout=timeout)
        except ReceiveTimeout:
            continue
        except HeartbeatTimeout:
            raise
        except ConnectionClosed:
            return
        _display(msg)
        n += 1

def parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(description="Beacon G6 TCP37591 codec and peer tools. Network commands run only when explicitly selected.")
    sub = ap.add_subparsers(dest="command", required=True)
    decode = sub.add_parser("decode", help="decode a reassembled framed TCP byte stream, not a pcap file")
    decode.add_argument("input", help="path or - for stdin")
    decode.add_argument("--profile", choices=["common", "ijl", "hjl"], default="common")
    encode = sub.add_parser("encode", help="write one frame without connecting anywhere")
    encode.add_argument("--kind", choices=[x.value for x in Kind], required=True)
    encode.add_argument("--url", required=True)
    encode.add_argument("--sequence", type=int, default=0, help="transport sequence")
    inputs = encode.add_mutually_exclusive_group()
    inputs.add_argument("--payload-file", help="raw exact payload bytes, including any chosen terminating NUL")
    inputs.add_argument("--application-file", help="inner AI JSON object; wrapped and NUL-terminated")
    encode.add_argument("--direction", choices=["report", "action"], default="report")
    encode.add_argument("--mac", default="00:00:00:00:00:00")
    encode.add_argument("--heartbeat-sequence", type=int, default=1)
    encode.add_argument("--interval", type=int, default=14000, help="raw heartbeat interval field")
    encode.add_argument("--missed-count", type=int, default=4)
    encode.add_argument("--profile", choices=["common", "ijl", "hjl"], default="common")
    encode.add_argument("--output", required=True, help="path or - for raw stdout")
    for command, help_text in [("watch", "connect as an agent, send login, and receive/acknowledge traffic"), ("send-report", "connect and send an explicitly supplied controller report")]:
        p = sub.add_parser(command, help=help_text)
        p.add_argument("host")
        p.add_argument("--port", type=int, default=37591)
        p.add_argument("--timeout", type=float, default=5.0)
        p.add_argument("--profile", choices=["common", "ijl", "hjl"], default="common")
        p.add_argument("--advertised-url", help="override the unique socket identity; duplicate identities can replace an existing vendor channel")
        p.add_argument("--no-heartbeats", action="store_true")
        if command == "watch":
            p.add_argument("--count", type=int, default=0, help="0 means until peer closes or Ctrl-C")
        else:
            p.add_argument("--json", required=True, dest="application_file")
            p.add_argument("--mac", default="00:00:00:00:00:00")
    server = sub.add_parser("serve", help="accept one explicit agent connection; not a complete RRM controller")
    server.add_argument("--bind", default="127.0.0.1")
    server.add_argument("--port", type=int, default=37591)
    server.add_argument("--timeout", type=float, default=5.0)
    server.add_argument("--profile", choices=["common", "ijl", "hjl"], default="common")
    server.add_argument("--count", type=int, default=0)
    server.add_argument("--action", help="inner action JSON to send once, after a login record")
    server.add_argument("--mac", default="00:00:00:00:00:00")
    server.add_argument("--no-heartbeats", action="store_true")
    return ap

def main(argv=None) -> int:
    ap = parser()
    args = ap.parse_args(argv)
    if getattr(args, "count", 0) < 0:
        ap.error("--count must be nonnegative")
    try:
        if args.command == "decode":
            decoder = FrameDecoder(max_record_size=record_limit(args.profile))
            source = sys.stdin.buffer if args.input == "-" else open(args.input, "rb")
            try:
                while chunk := source.read(65536):
                    for record in decoder.feed(chunk):
                        _display(Message.from_record(record, max_record_size=record_limit(args.profile)))
                decoder.finish()
            finally:
                if args.input != "-":
                    source.close()
        elif args.command == "encode":
            kind = Kind(args.kind)
            if args.payload_file:
                payload = _read(args.payload_file)
            elif args.application_file:
                if kind not in (Kind.REQUEST, Kind.REPLY):
                    raise ValueError("application file requires request/reply kind")
                data = _object(args.application_file)
                (validate_report if args.direction == "report" else validate_action)(data)
                payload = Envelope(data, mac=args.mac).to_payload()
            elif kind in (Kind.LOGIN, Kind.LOGOUT):
                payload = args.url.encode("ascii") + b"\0"
            elif kind == Kind.HEARTBEAT:
                payload = Heartbeat(args.heartbeat_sequence, args.interval, args.missed_count).to_payload()
            elif kind == Kind.HEARTBEAT_ACK:
                payload = heartbeat_ack(args.heartbeat_sequence)
            else:
                raise ValueError("request/reply requires --payload-file or --application-file")
            frame = Message(args.sequence, kind, args.url, payload).to_frame(max_record_size=record_limit(args.profile))
            if args.output == "-":
                sys.stdout.buffer.write(frame)
            else:
                Path(args.output).write_bytes(frame)
        elif args.command in ("watch", "send-report"):
            # Check the user's application before opening the connection.
            data = _object(args.application_file) if args.command == "send-report" else None
            if data is not None:
                validate_report(data)
                Envelope(data, mac=args.mac).to_payload()
            with connect_controller(args.host, args.port, advertised_url=args.advertised_url,
                                    timeout=args.timeout, profile=args.profile,
                                    auto_heartbeat=not args.no_heartbeats) as peer:
                if data is not None:
                    msg = peer.send_report(data, mac=args.mac)
                    print(json.dumps({"sent_sequence": msg.sequence, "application_acceptance": "not confirmed"}))
                else:
                    _loop(peer, args.count, args.timeout)
        else:
            action = _object(args.action) if args.action else None
            if action is not None:
                validate_action(action)
                Envelope(action, mac=args.mac).to_payload()
            with ControllerServer(args.bind, args.port, timeout=args.timeout, profile=args.profile,
                                  auto_heartbeat=not args.no_heartbeats) as server:
                print(f"listening on {server.address[0]}:{server.address[1]}", file=sys.stderr, flush=True)
                with server.accept() as peer:
                    n = 0
                    while args.count == 0 or n < args.count:
                        try:
                            msg = peer.receive(timeout=args.timeout)
                        except ReceiveTimeout:
                            continue
                        except HeartbeatTimeout:
                            raise
                        except ConnectionClosed:
                            break
                        _display(msg)
                        n += 1
                        if action is not None and msg.kind == Kind.LOGIN:
                            peer.send_action(action, mac=args.mac)
                            action = None
        return 0
    except KeyboardInterrupt:
        return 130
    except (OSError, ValueError) as exc:
        print(f"mesh37591: {exc}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
