"""One complete client/server exchange on local loopback only."""
from beacon_mesh37591 import ControllerServer, connect_controller, scan_enabled

with ControllerServer(port=0, auto_heartbeat=False) as server:
    with connect_controller(*server.address, auto_heartbeat=False) as agent:
        with server.accept() as controller:
            print("login:", controller.receive().kind)
            agent.send_report({"request_type": 5, "note": "local example"})
            print("report:", controller.receive().application().data)
            controller.send_action(scan_enabled(False))
            print("action:", agent.receive().application().data)
