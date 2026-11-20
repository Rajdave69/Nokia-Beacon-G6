"""Observe authenticated stock 8099 notifications on explicitly named Beacons."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from getpass import getpass
import json
from queue import Empty, Full, Queue
import random
from threading import Event, Thread

from beacon8099 import AuthenticationError, Beacon8099, Beacon8099Error


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def observe(alias, host, username, password, stop, emit, include_payload, *,
            connect=Beacon8099.connect, delay=random.uniform):
    """Run one feed. A connection is an epoch in which some events may be missed."""
    failures = 0
    generation = 0
    while not stop.is_set():
        try:
            with connect(host, username, password, timeout=5) as client:
                generation += 1
                emit(alias, "connected", generation=generation, snapshot_required=True)
                while not stop.is_set():
                    try:
                        message = client.receive(timeout=1)
                    except TimeoutError:
                        continue
                    if message.event is None:
                        continue
                    failures = 0
                    fields = {"generation": generation, "event": message.event}
                    if include_payload:
                        fields["data"] = message.data
                    emit(alias, "notification", **fields)
        except AuthenticationError as exc:
            if exc.status in (503, 509):
                emit(alias, "unavailable", status=exc.status, snapshot_required=True)
            else:
                emit(alias, "authentication_stopped", status=exc.status, snapshot_required=True)
                return
        except Beacon8099Error:
            emit(alias, "disconnected" if generation else "unavailable",
                 generation=generation, snapshot_required=True)
        except ValueError:
            emit(alias, "invalid_connection_settings", snapshot_required=True)
            return
        if stop.is_set():
            return
        ceiling = min(60, 5 * (2 ** min(failures, 4)))
        failures += 1
        stop.wait(delay(ceiling / 2, ceiling))


def target(value):
    fields = value.split("=", 2)
    if len(fields) != 3 or not all(fields):
        raise argparse.ArgumentTypeError("Use ALIAS=HOST=ACCOUNT.")
    return fields


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--router", type=target, action="append", required=True,
                        metavar="ALIAS=HOST=ACCOUNT")
    parser.add_argument("--include-payload", action="store_true",
                        help="Include private router and client data in JSON output.")
    args = parser.parse_args(argv)
    aliases = [alias for alias, _, _ in args.router]
    if len(set(aliases)) != len(aliases):
        parser.error("Each router must have a unique alias.")
    endpoints = [host.casefold().rstrip(".") for _, host, _ in args.router]
    if len(set(endpoints)) != len(endpoints):
        parser.error("Supply each router host once.")
    passwords = [getpass(f"Password for {alias}: ") for alias in aliases]
    stop = Event()
    records = Queue(maxsize=256)

    def emit(alias, kind, **fields):
        record = {"received_at": timestamp(), "router": alias, "kind": kind, **fields}
        while not stop.is_set():
            try:
                records.put(record, timeout=0.25)
                return
            except Full:
                pass

    workers = [
        Thread(target=observe, args=(alias, host, user, password, stop, emit,
                                     args.include_payload), daemon=True)
        for (alias, host, user), password in zip(args.router, passwords)
    ]
    for worker in workers:
        worker.start()
    try:
        while any(worker.is_alive() for worker in workers) or not records.empty():
            try:
                record = records.get(timeout=0.25)
            except Empty:
                continue
            print(json.dumps(record, ensure_ascii=True), flush=True)
    except KeyboardInterrupt:
        return 130
    finally:
        stop.set()
        for worker in workers:
            worker.join(timeout=2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
