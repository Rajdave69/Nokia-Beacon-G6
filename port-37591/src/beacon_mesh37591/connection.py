"""Explicit IPv4 TCP client/server peers; no radio actions are applied locally.

Use one receiver per connection. Sends are serialized. Receive deadlines retain
partial frames. Automatic heartbeats run while receive() is being serviced;
there is no hidden background thread or auto-discovery.
"""
from __future__ import annotations
from collections import deque
from enum import Enum
import select
import socket
import threading
import time
from .codec import Kind, Message, FrameDecoder, record_limit, validate_url
from .application import Envelope, Heartbeat, heartbeat_ack, parse_heartbeat_ack, validate_report, validate_action
from .errors import ProtocolError, ApplicationError, ConnectionClosed, ReceiveTimeout, HeartbeatTimeout

class Role(str, Enum):
    AGENT = "agent"
    CONTROLLER = "controller"

def _positive(value: float, name: str) -> float:
    import math
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name} must be a finite positive number")
    return float(value)

def _remaining(deadline: float) -> float:
    return max(0.0, deadline - time.monotonic())

class MeshConnection:
    def __init__(self, sock: socket.socket, *, role: Role | str, local_url: str,
                 profile: str = "common", timeout: float = 5.0,
                 auto_heartbeat: bool = True, heartbeat_interval: float | None = None,
                 heartbeat_count: int = 4):
        self.role = Role(role)
        self.local_url = validate_url(local_url)
        self.max_record_size = record_limit(profile)
        self.timeout = _positive(timeout, "timeout")
        if type(auto_heartbeat) is not bool:
            raise ValueError("auto_heartbeat must be a bool")
        self.auto_heartbeat = auto_heartbeat
        self.heartbeat_interval = _positive(heartbeat_interval if heartbeat_interval is not None else (14.0 if self.role == Role.AGENT else 12.0), "heartbeat_interval")
        if self.heartbeat_interval * 1000 > 0x7fffffff:
            raise ValueError("heartbeat interval exceeds the signed-32-bit wire field")
        if type(heartbeat_count) is not int or not 1 <= heartbeat_count <= 0x7fffffff:
            raise ValueError("heartbeat_count must be a positive signed-32-bit integer")
        self.heartbeat_count = heartbeat_count
        self.peer_url: str | None = None
        self._socket = sock
        self._socket.setblocking(False)
        self._decoder = FrameDecoder(max_record_size=self.max_record_size)
        self._messages: deque[Message] = deque()
        self._send_lock = threading.Lock()
        self._sequence = 0
        self._heartbeat_sequence = 1
        self._pending_heartbeats: dict[int, None] = {}
        self._next_heartbeat = time.monotonic() + self.heartbeat_interval
        self.closed = False

    def fileno(self) -> int:
        return self._socket.fileno()

    def _ensure_open(self) -> None:
        if self.closed:
            raise ConnectionClosed("connection is closed")

    def send_message(self, kind: Kind | str, payload: bytes, *, sequence: int | None = None) -> Message:
        """Send one complete record. A returned Message proves a local send only."""
        with self._send_lock:
            self._ensure_open()
            msg = Message(self._sequence if sequence is None else sequence, Kind(kind), self.local_url, payload)
            frame = msg.to_frame(max_record_size=self.max_record_size)
            deadline = time.monotonic() + self.timeout
            view = memoryview(frame)
            try:
                while view:
                    remaining = _remaining(deadline)
                    if not remaining:
                        raise TimeoutError("TCP send deadline expired; delivery is uncertain")
                    _, ready, _ = select.select([], [self._socket], [], remaining)
                    if not ready:
                        raise TimeoutError("TCP send deadline expired; delivery is uncertain")
                    try:
                        n = self._socket.send(view)
                    except (BlockingIOError, InterruptedError):
                        continue
                    if n == 0:
                        raise ConnectionClosed("peer closed during send")
                    view = view[n:]
            except (OSError, TimeoutError):
                self.close()
                raise
            if sequence is None:
                # Canonical package policy: nonnegative wrap; raw Message also
                # represents signed sequences seen in vendor records.
                self._sequence = 0 if self._sequence == 0x7fffffff else self._sequence + 1
            return msg

    def login(self) -> Message:
        return self.send_message(Kind.LOGIN, self.local_url.encode("ascii") + b"\0")

    def logout(self) -> Message:
        message = self.send_message(Kind.LOGOUT, self.local_url.encode("ascii") + b"\0")
        self.close()
        return message

    def send_envelope(self, envelope: Envelope, *, kind: Kind = Kind.REQUEST, sequence: int | None = None) -> Message:
        """Low-level envelope send; typed direction checks are in the next methods."""
        if kind not in (Kind.REQUEST, Kind.REPLY):
            raise ApplicationError("application envelope requires request/reply kind")
        return self.send_message(kind, envelope.to_payload(), sequence=sequence)

    def send_report(self, data: dict, *, mac: str = "00:00:00:00:00:00") -> Message:
        """Agent -> controller. Supply a complete captured/known report.

        Validates report type and JSON, not the entire RF telemetry schema.
        No synthetic sensor values or model capabilities are filled in.
        """
        if self.role != Role.AGENT:
            raise ApplicationError("send_report requires the agent side")
        validate_report(data)
        return self.send_envelope(Envelope(data, mac=mac))

    def send_action(self, data: dict, *, mac: str = "00:00:00:00:00:00") -> Message:
        """Controller -> connected agent. This does not apply a local radio action."""
        if self.role != Role.CONTROLLER:
            raise ApplicationError("send_action requires the controller side")
        validate_action(data)
        return self.send_envelope(Envelope(data, mac=mac))

    def _tick(self) -> None:
        if not self.auto_heartbeat or time.monotonic() < self._next_heartbeat:
            return
        if self.role == Role.CONTROLLER and self.peer_url is None:
            self._next_heartbeat = time.monotonic() + self.heartbeat_interval
            return
        if len(self._pending_heartbeats) >= self.heartbeat_count:
            self.close()
            raise HeartbeatTimeout("no heartbeat acknowledgement within the configured missed-count window")
        sequence = self._heartbeat_sequence
        interval = max(1, round(self.heartbeat_interval * 1000))
        self.send_message(Kind.HEARTBEAT, Heartbeat(sequence, interval, self.heartbeat_count).to_payload())
        self._pending_heartbeats[sequence] = None
        self._heartbeat_sequence = 1 if sequence == 0x7fffffff else sequence + 1
        self._next_heartbeat = time.monotonic() + self.heartbeat_interval

    def _control(self, msg: Message) -> None:
        if msg.kind == Kind.LOGIN:
            # Received identity is metadata, never a new connection target.
            raw = msg.payload[:-1] if msg.payload.endswith(b"\0") else msg.payload
            try:
                self.peer_url = validate_url(raw.decode("ascii"))
            except (UnicodeError, ProtocolError) as exc:
                raise ProtocolError("invalid login URL payload") from exc
        elif msg.kind == Kind.HEARTBEAT:
            hb = Heartbeat.from_payload(msg.payload)
            if self.auto_heartbeat:
                self.send_message(Kind.HEARTBEAT_ACK, heartbeat_ack(hb.sequence))
        elif msg.kind == Kind.HEARTBEAT_ACK:
            sequence = parse_heartbeat_ack(msg.payload)
            # A later acknowledged heartbeat proves progress; don't leave
            # older delayed acknowledgements occupying the outstanding set.
            if sequence in self._pending_heartbeats:
                for old in list(self._pending_heartbeats):
                    del self._pending_heartbeats[old]
                    if old == sequence:
                        break

    def receive(self, *, timeout: float | None = None) -> Message:
        """Return the next message, including login and heartbeat records.

        Heartbeat responses are automatic when enabled. A ReceiveTimeout does
        not discard partial frames. One reader must service this method to
        schedule heartbeats; no background worker runs behind the caller.
        """
        self._ensure_open()
        deadline = time.monotonic() + (self.timeout if timeout is None else _positive(timeout, "timeout"))
        while True:
            if self._messages:
                msg = self._messages.popleft()
                try:
                    self._control(msg)
                except ProtocolError:
                    self.close()
                    raise
                return msg
            self._tick()
            remaining = _remaining(deadline)
            if not remaining:
                raise ReceiveTimeout("receive deadline expired; partial frame retained")
            wait = remaining
            if self.auto_heartbeat:
                wait = min(wait, max(0.0, self._next_heartbeat - time.monotonic()))
            try:
                ready, _, _ = select.select([self._socket], [], [], wait)
                if not ready:
                    continue
                try:
                    chunk = self._socket.recv(65536)
                except (BlockingIOError, InterruptedError):
                    continue
                if not chunk:
                    self._decoder.finish()
                    self.close()
                    raise ConnectionClosed("peer closed the stream")
                for raw in self._decoder.feed(chunk):
                    self._messages.append(Message.from_record(raw, max_record_size=self.max_record_size))
            except ProtocolError:
                self.close()
                raise
            except OSError as exc:
                self.close()
                raise ConnectionClosed("TCP receive failed") from exc

    def close(self) -> None:
        if not self.closed:
            self.closed = True
            self._socket.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()

def connect_controller(host: str, port: int = 37591, *, advertised_url: str | None = None,
                       local_address: tuple[str, int] | None = None, timeout: float = 5.0,
                       profile: str = "common", auto_heartbeat: bool = True,
                       heartbeat_interval: float = 14.0, heartbeat_count: int = 4) -> MeshConnection:
    """Connect as an agent, advertise this socket's own address, and send login.

    No network operation occurs until called. There is no scan, discovery,
    credential generation, peer-URL following or report auto-transmission.
    """
    _positive(timeout, "timeout")
    record_limit(profile)
    if type(port) is not int or not 1 <= port <= 65535:
        raise ValueError("port must be in 1..65535")
    if advertised_url is not None:
        validate_url(advertised_url)
    if type(auto_heartbeat) is not bool:
        raise ValueError("auto_heartbeat must be a bool")
    if _positive(heartbeat_interval, "heartbeat_interval") * 1000 > 0x7fffffff:
        raise ValueError("heartbeat interval exceeds the wire field")
    if type(heartbeat_count) is not int or not 1 <= heartbeat_count <= 0x7fffffff:
        raise ValueError("invalid heartbeat_count")
    candidates = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
    last = None
    for family, kind, protocol, _, address in candidates:
        sock = socket.socket(family, kind, protocol)
        sock.settimeout(timeout)
        try:
            if local_address is not None:
                sock.bind(local_address)
            sock.connect(address)
            ip, source_port = sock.getsockname()
            url = advertised_url if advertised_url is not None else f"tcp://{ip}:{source_port}"
            peer = MeshConnection(sock, role=Role.AGENT, local_url=url, profile=profile, timeout=timeout,
                                  auto_heartbeat=auto_heartbeat, heartbeat_interval=heartbeat_interval,
                                  heartbeat_count=heartbeat_count)
            peer.login()
            return peer
        except OSError as exc:
            last = exc
            sock.close()
        except Exception:
            sock.close()
            raise
    if last is not None:
        raise last
    raise OSError("no IPv4 TCP addresses resolved")

class ControllerServer:
    """A small protocol server, not a Nokia RRM controller implementation.

    Caller explicitly accepts, receives reports and sends any chosen actions.
    No login-based eviction, peer discovery or radio actions run automatically.
    """
    def __init__(self, bind: str = "127.0.0.1", port: int = 37591, *, timeout: float = 5.0,
                 profile: str = "common", auto_heartbeat: bool = True,
                 heartbeat_interval: float = 12.0, heartbeat_count: int = 4):
        if type(port) is not int or not 0 <= port <= 65535:
            raise ValueError("server port must be in 0..65535")
        self.timeout = _positive(timeout, "timeout")
        record_limit(profile)
        if type(auto_heartbeat) is not bool:
            raise ValueError("auto_heartbeat must be a bool")
        if _positive(heartbeat_interval, "heartbeat_interval") * 1000 > 0x7fffffff:
            raise ValueError("heartbeat interval exceeds the wire field")
        if type(heartbeat_count) is not int or not 1 <= heartbeat_count <= 0x7fffffff:
            raise ValueError("invalid heartbeat_count")
        self.profile = profile
        self.auto_heartbeat = auto_heartbeat
        self.heartbeat_interval = heartbeat_interval
        self.heartbeat_count = heartbeat_count
        self._peers: list[MeshConnection] = []
        self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            self._socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self._socket.bind((bind, port))
            self._socket.listen(8)
            self._socket.settimeout(self.timeout)
        except Exception:
            self._socket.close()
            raise
        self.address = self._socket.getsockname()
        self.closed = False

    def accept(self) -> MeshConnection:
        if self.closed:
            raise ConnectionClosed("server is closed")
        sock, _ = self._socket.accept()
        ip, port = sock.getsockname()
        try:
            peer = MeshConnection(sock, role=Role.CONTROLLER, local_url=f"tcp://{ip}:{port}",
                                  profile=self.profile, timeout=self.timeout,
                                  auto_heartbeat=self.auto_heartbeat, heartbeat_interval=self.heartbeat_interval,
                                  heartbeat_count=self.heartbeat_count)
        except Exception:
            sock.close()
            raise
        self._peers.append(peer)
        return peer

    def broadcast_action(self, data: dict, *, mac: str = "00:00:00:00:00:00") -> list[tuple[MeshConnection, Message | Exception]]:
        """Report per-peer delivery outcome; failures are not silently discarded."""
        validate_action(data)
        result = []
        for peer in self._peers:
            if peer.closed:
                continue
            try:
                result.append((peer, peer.send_action(data, mac=mac)))
            except (OSError, ProtocolError) as exc:
                result.append((peer, exc))
        return result

    def close(self):
        if not self.closed:
            self.closed = True
            for peer in self._peers:
                peer.close()
            self._socket.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
