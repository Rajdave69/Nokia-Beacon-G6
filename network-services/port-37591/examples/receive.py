"""Connect only when run explicitly with an owner-supplied hostname."""
import argparse
from beacon_mesh37591 import connect_controller, ReceiveTimeout, ConnectionClosed

parser = argparse.ArgumentParser()
parser.add_argument("host")
args = parser.parse_args()
try:
    with connect_controller(args.host) as peer:
        while True:
            try:
                message = peer.receive(timeout=5)
            except ReceiveTimeout:
                continue
            print(message.kind.value, message.sequence, message.payload)
except (KeyboardInterrupt, ConnectionClosed):
    pass
