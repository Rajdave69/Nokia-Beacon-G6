"""Errors distinguish framing, application data, and connection state."""
class ProtocolError(ValueError):
    """An invalid or unsupported wire representation."""

class FrameError(ProtocolError):
    """Invalid watermark, length, or truncated framed stream."""

class ApplicationError(ProtocolError):
    """Invalid JSON envelope, heartbeat payload, or typed action."""

class ConnectionClosed(ConnectionError):
    """Peer closed the TCP stream or the local connection is closed."""

class ReceiveTimeout(TimeoutError):
    """Receive deadline expired; buffered partial input is preserved."""

class HeartbeatTimeout(ConnectionClosed):
    """The package's outstanding-heartbeat limit was exceeded."""
