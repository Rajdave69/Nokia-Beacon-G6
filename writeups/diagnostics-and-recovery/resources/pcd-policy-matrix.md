# Packaged PCD policy matrix

Generated from the full source records in `inventory.json`. ACTIVE is the packaged switch; it does not prove that a runtime gate is satisfied or a process is running.

| Profile | Rule | Active | Start condition | Failure action | Timeout (ms) | Command |
| --- | --- | --- | --- | --- | --- | --- |
| `G6-HJL` | `service_ECD` | `NO` | `RULE_COMPLETED service_system_init service_NVA` | `RESTART` | `-1` | `/usr/bin/run_ecd.sh` |
| `G6-HJL` | `service_HABoard` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/ha_board` |
| `G6-HJL` | `service_HAForDDM` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/exe/ha_board.sh` |
| `G6-HJL` | `service_HomeAgent` | `YES` | `FILE /tmp/nwf-board-param.json` | `NONE` | `-1` | `/usr/bin/homeagent` |
| `G6-HJL` | `service_NVA` | `NO` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/usr/bin/run_nva.sh` |
| `G6-HJL` | `service_USSA` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/run_ussa.sh > /dev/console` |
| `G6-HJL` | `service_ai_agent` | `NO` | `RULE_COMPLETED service_system_init service_NVA` | `RESTART` | `-1` | `/usr/bin/run_aiagent.sh` |
| `G6-HJL` | `service_ai_controller` | `NO` | `RULE_COMPLETED service_system_init service_ai_agent` | `RESTART` | `-1` | `/usr/bin/run_aicontroller.sh` |
| `G6-HJL` | `service_bdemgr` | `YES` | `FILE /tmp/bde_enabled` | `RESTART` | `-1` | `/usr/bin/bdemgr` |
| `G6-HJL` | `service_boeng` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/boengAgent` |
| `G6-HJL` | `service_cfgmgr` | `YES` | `RULE_COMPLETED service_ndk_wand service_msgmgr SECURITY_SERVICES service_wifi_sched service_dbmgr` | `REBOOT` | `-1` | `/usr/bin/cfgmgr > /dev/console` |
| `G6-HJL` | `service_cthulhu` | `YES` | `RULE_COMPLETED service_timingila` | `NONE` | `-1` | `/usr/bin/run_cthulhu.sh` |
| `G6-HJL` | `service_dataelement` | `YES` | `RULE_COMPLETED service_cfgmgr service_dbmgr` | `NONE` | `-1` | `/usr/bin/dataelement -f > /dev/console` |
| `G6-HJL` | `service_dbmgr` | `YES` | `RULE_COMPLETED SECURITY_SERVICES` | `REBOOT` | `300000` | `/usr/bin/ndbd --default=/etc/datamodel.db --dbfile=/configs/dmdb_encryption.cfg --backup=/configs/dmdb_encryption.cfg.bak --prepare=/usr/bin/cfgmgr_db_prepare > /dev/console` |
| `G6-HJL` | `service_ddm` | `YES` | `FILE /tmp/nwf-ua-enabled` | `RESTART` | `-1` | `/usr/bin/ddm` |
| `G6-HJL` | `service_dhcpsnoop` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/dhcpsnoop` |
| `G6-HJL` | `service_diagnosis` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/diagnosis` |
| `G6-HJL` | `service_igmpd` | `YES` | `FILE /tmp/igmp_boot` | `RESTART` | `-1` | `/sbin/igmpd /configs/igmprt.conf` |
| `G6-HJL` | `service_lanhostd` | `YES` | `FILE /tmp/lanhostd_boot` | `NONE` | `-1` | `/usr/bin/lanhostd -m 0 -f 0 -t 1` |
| `G6-HJL` | `service_lcm-adapter` | `YES` | `RULE_COMPLETED,service_cfgmgr,service_cthulhu` | `RESTART` | `-1` | `/usr/bin/lcm-adapter` |
| `G6-HJL` | `service_ledmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ledmgr` |
| `G6-HJL` | `service_msgmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/msgmgr -s` |
| `G6-HJL` | `service_ndk_appsd` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr` | `REBOOT` | `-1` | `/sbin/ndk_appsd` |
| `G6-HJL` | `service_ndk_evtmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_evtmgr` |
| `G6-HJL` | `service_ndk_ramond` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/sbin/ndk_ramond` |
| `G6-HJL` | `service_ndktimer` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ndk_timer` |
| `G6-HJL` | `service_ndk_wand` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr service_ndk_appsd` | `REBOOT` | `-1` | `/sbin/ndk_wand` |
| `G6-HJL` | `service_ndk_xiptmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_xiptmgr` |
| `G6-HJL` | `service_nuspd` | `NO` | `NONE` | `RESTART` | `-1` | `/sbin/nuspd` |
| `G6-HJL` | `service_obuspa` | `YES` | `FILE /tmp/obuspaStart` | `RESTART` | `-1` | `/sbin/obuspa -v 1 -r /etc/uspfactory_reset.conf -l syslog` |
| `G6-HJL` | `service_premeshctl` | `NO` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/bin/sh /usr/bin/premeshctl.sh` |
| `G6-HJL` | `service_raccess` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/raccess` |
| `G6-HJL` | `service_rlyeh` | `YES` | `RULE_COMPLETED service_cfgmgr service_nuspd service_rpcd` | `NONE` | `-1` | `/usr/bin/rlyeh -D` |
| `G6-HJL` | `service_rpcd` | `YES` | `FILE /tmp/.boot.finish /var/run/ubus-session/ubus.sock` | `RESTART` | `-1` | `/sbin/rpcd -t 30` |
| `G6-HJL` | `SECURITY_SERVICES` | `YES` | `NONE` | `NONE` | `-1` | `/sbin/secInit.sh` |
| `G6-HJL` | `service_srmf` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/srmf` |
| `G6-HJL` | `service_swmgnt` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/load_app -d InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable=true -- /usr/bin/swmgnt` |
| `G6-HJL` | `service_syncmgr` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/syncmgr` |
| `G6-HJL` | `service_system_init` | `YES` | `NONE` | `NONE` | `-1` | `/bin/sh /usr/bin/system_init.sh` |
| `G6-HJL` | `service_timingila` | `YES` | `RULE_COMPLETED service_rlyeh` | `NONE` | `-1` | `/usr/bin/timingila -D` |
| `G6-HJL` | `service_tr069` | `YES` | `FILE /tmp/tr069client_enabled` | `RESTART` | `-1` | `tr069client -d /configs/tr069_conf` |
| `G6-HJL` | `service_ubus_session` | `YES` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/sbin/ubusd -s /var/run/ubus-session/ubus.sock` |
| `G6-HJL` | `service_uplinkmgr` | `YES` | `FILE /tmp/evtmgr_ready` | `NONE` | `-1` | `/usr/bin/uplinkmgr` |
| `G6-HJL` | `service_uspCfgUpdate` | `YES` | `FILE /tmp/uspCfgUpdateStart` | `RESTART` | `-1` | `/usr/bin/uspCfgUpdate` |
| `G6-HJL` | `service_uva` | `YES` | `RULE_COMPLETED service_cfgmgr service_ubus_session` | `RESTART` | `-1` | `/sbin/uva -u appService` |
| `G6-HJL` | `service_wanlived` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/wanlived` |
| `G6-HJL` | `service_web` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/webs/thttpd -dd /webs` |
| `G6-HJL` | `service_wifi_sched` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/usr/sbin/sched > /dev/console` |
| `G6-HJL` | `service_wifimon` | `YES` | `FILE /tmp/start_wifimon.txt` | `RESTART` | `-1` | `/usr/sbin/wifimond` |
| `G6-HJL` | `service_wlancli` | `YES` | `NONE` | `NONE` | `-1` | `/usr/bin/wlancli setWpsDaemon` |
| `G6-HJL` | `service_xmppc` | `YES` | `FILE /tmp/xmppc_enable` | `RESTART` | `-1` | `/usr/bin/xmppc /configs/xmpp/xmpp.conf` |
| `G6-IJL` | `service_ECD` | `NO` | `RULE_COMPLETED service_system_init service_NVA` | `RESTART` | `-1` | `/usr/bin/run_ecd.sh` |
| `G6-IJL` | `service_HABoard` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/ha_board` |
| `G6-IJL` | `service_HAForDDM` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/exe/ha_board.sh` |
| `G6-IJL` | `service_HomeAgent` | `YES` | `FILE /tmp/nwf-board-param.json` | `NONE` | `-1` | `/usr/bin/homeagent` |
| `G6-IJL` | `service_NVA` | `NO` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/usr/bin/run_nva.sh` |
| `G6-IJL` | `service_USSA` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/run_ussa.sh > /dev/console` |
| `G6-IJL` | `service_bdemgr` | `YES` | `FILE /tmp/bde_enabled` | `RESTART` | `-1` | `/usr/bin/bdemgr` |
| `G6-IJL` | `service_boeng` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/boengAgent` |
| `G6-IJL` | `service_cfgmgr` | `YES` | `RULE_COMPLETED service_ndk_wand service_msgmgr SECURITY_SERVICES service_wifi_sched service_dbmgr` | `REBOOT` | `-1` | `/usr/bin/cfgmgr > /dev/console` |
| `G6-IJL` | `service_container` | `YES` | `RULE_COMPLETED service_rpcd` | `RESTART` | `-1` | `/usr/bin/ContainerMgr` |
| `G6-IJL` | `service_dbmgr` | `YES` | `RULE_COMPLETED SECURITY_SERVICES` | `REBOOT` | `300000` | `/usr/bin/ndbd --default=/etc/datamodel.db --dbfile=/configs/dmdb_encryption.cfg --backup=/configs/dmdb_encryption.cfg.bak --prepare=/usr/bin/cfgmgr_db_prepare > /dev/console` |
| `G6-IJL` | `service_ddm` | `YES` | `FILE /tmp/nwf-ua-enabled` | `RESTART` | `-1` | `/usr/bin/ddm` |
| `G6-IJL` | `service_dhcpsnoop` | `YES` | `FILE /tmp/dhcpsnoop_boot` | `RESTART` | `-1` | `/usr/bin/dhcpsnoop` |
| `G6-IJL` | `service_diagnosis` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/diagnosis` |
| `G6-IJL` | `service_igmpd` | `YES` | `FILE /tmp/igmp_boot` | `RESTART` | `-1` | `/sbin/igmpd /configs/igmprt.conf` |
| `G6-IJL` | `service_lanhostd` | `YES` | `FILE /tmp/lanhostd_boot` | `NONE` | `-1` | `/usr/bin/lanhostd -m 0 -f 0 -t 1` |
| `G6-IJL` | `service_ledmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ledmgr` |
| `G6-IJL` | `service_msgmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/msgmgr -s` |
| `G6-IJL` | `service_ndk_appsd` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr` | `REBOOT` | `-1` | `/sbin/ndk_appsd` |
| `G6-IJL` | `service_ndk_evtmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_evtmgr` |
| `G6-IJL` | `service_ndk_ramond` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/sbin/ndk_ramond` |
| `G6-IJL` | `service_ndktimer` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ndk_timer` |
| `G6-IJL` | `service_ndk_wand` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr service_ndk_appsd` | `REBOOT` | `-1` | `/sbin/ndk_wand` |
| `G6-IJL` | `service_ndk_xiptmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_xiptmgr` |
| `G6-IJL` | `service_nuspd` | `NO` | `NONE` | `RESTART` | `-1` | `/sbin/nuspd` |
| `G6-IJL` | `service_obuspa` | `YES` | `FILE /tmp/obuspaStart` | `RESTART` | `-1` | `/sbin/obuspa -v 1 -r /etc/uspfactory_reset.conf -l syslog` |
| `G6-IJL` | `service_pluginmgr` | `YES` | `RULE_COMPLETED service_container` | `RESTART` | `-1` | `/usr/bin/PluginMgr` |
| `G6-IJL` | `service_premeshctl` | `NO` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/bin/sh /usr/bin/premeshctl.sh` |
| `G6-IJL` | `service_raccess` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/raccess` |
| `G6-IJL` | `service_rpcd` | `YES` | `FILE /tmp/.boot.finish /var/run/ubus-session/ubus.sock` | `RESTART` | `-1` | `/sbin/rpcd -s /var/run/ubus.sock -t 30` |
| `G6-IJL` | `SECURITY_SERVICES` | `YES` | `NONE` | `NONE` | `-1` | `/sbin/secInit.sh` |
| `G6-IJL` | `service_srmf` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/srmf` |
| `G6-IJL` | `service_swmgnt` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/load_app -d InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable=true -- /usr/bin/swmgnt` |
| `G6-IJL` | `service_syncmgr` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/syncmgr` |
| `G6-IJL` | `service_system_init` | `YES` | `NONE` | `NONE` | `-1` | `/bin/sh /usr/bin/system_init.sh` |
| `G6-IJL` | `service_tr069` | `YES` | `FILE /tmp/tr069client_enabled` | `RESTART` | `-1` | `tr069client -d /configs/tr069_conf` |
| `G6-IJL` | `service_ubus_session` | `YES` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/sbin/ubusd -s /var/run/ubus-session/ubus.sock` |
| `G6-IJL` | `service_uplinkmgr` | `YES` | `FILE /tmp/evtmgr_ready` | `NONE` | `-1` | `/usr/bin/uplinkmgr` |
| `G6-IJL` | `service_uspCfgUpdate` | `YES` | `FILE /tmp/uspCfgUpdateStart` | `RESTART` | `-1` | `/usr/bin/uspCfgUpdate` |
| `G6-IJL` | `service_uva` | `YES` | `RULE_COMPLETED service_cfgmgr service_ubus_session` | `RESTART` | `-1` | `/sbin/uva -u appService` |
| `G6-IJL` | `service_wanlived` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/wanlived` |
| `G6-IJL` | `service_web` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/webs/thttpd -dd /webs` |
| `G6-IJL` | `service_wifi_sched` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/usr/sbin/sched` |
| `G6-IJL` | `service_wifimon` | `YES` | `FILE /tmp/start_wifimon.txt` | `RESTART` | `-1` | `/usr/sbin/wifimond` |
| `G6-IJL` | `service_wlancli` | `YES` | `NONE` | `NONE` | `-1` | `/usr/bin/wlancli setWpsDaemon` |
| `B9-JJM` | `service_ECD` | `NO` | `RULE_COMPLETED service_system_init service_NVA` | `RESTART` | `-1` | `/usr/bin/run_ecd.sh` |
| `B9-JJM` | `service_HABoard` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/ha_board` |
| `B9-JJM` | `service_HAForDDM` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/exe/ha_board.sh` |
| `B9-JJM` | `service_HomeAgent` | `YES` | `FILE /tmp/nwf-board-param.json` | `NONE` | `-1` | `/usr/bin/homeagent` |
| `B9-JJM` | `service_NVA` | `NO` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/usr/bin/run_nva.sh` |
| `B9-JJM` | `service_USSA` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/run_ussa.sh > /dev/console` |
| `B9-JJM` | `service_ai_agent` | `NO` | `RULE_COMPLETED service_system_init service_NVA` | `RESTART` | `-1` | `/usr/bin/run_aiagent.sh` |
| `B9-JJM` | `service_ai_controller` | `NO` | `RULE_COMPLETED service_system_init service_ai_agent` | `RESTART` | `-1` | `/usr/bin/run_aicontroller.sh` |
| `B9-JJM` | `service_bdemgr` | `YES` | `FILE /tmp/bde_enabled` | `RESTART` | `-1` | `/usr/bin/bdemgr` |
| `B9-JJM` | `service_boeng` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/boengAgent` |
| `B9-JJM` | `service_cfgmgr` | `YES` | `RULE_COMPLETED service_ndk_wand service_msgmgr SECURITY_SERVICES service_wifi_sched service_dbmgr` | `REBOOT` | `-1` | `/usr/bin/cfgmgr > /dev/console` |
| `B9-JJM` | `service_cthulhu` | `YES` | `RULE_COMPLETED service_timingila` | `NONE` | `-1` | `/usr/bin/run_cthulhu.sh` |
| `B9-JJM` | `service_dataelement` | `YES` | `RULE_COMPLETED service_cfgmgr service_dbmgr` | `NONE` | `-1` | `/usr/bin/dataelement -f > /dev/console` |
| `B9-JJM` | `service_dbmgr` | `YES` | `RULE_COMPLETED SECURITY_SERVICES` | `REBOOT` | `300000` | `/usr/bin/ndbd --default=/etc/datamodel.db --dbfile=/configs/dmdb_encryption.cfg --backup=/configs/dmdb_encryption.cfg.bak --prepare=/usr/bin/cfgmgr_db_prepare > /dev/console` |
| `B9-JJM` | `service_ddm` | `YES` | `FILE /tmp/nwf-ua-enabled` | `RESTART` | `-1` | `/usr/bin/ddm` |
| `B9-JJM` | `service_dhcpsnoop` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/dhcpsnoop` |
| `B9-JJM` | `service_diagnosis` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/usr/bin/diagnosis` |
| `B9-JJM` | `service_igmpd` | `YES` | `FILE /tmp/igmp_boot` | `RESTART` | `-1` | `/sbin/igmpd /configs/igmprt.conf` |
| `B9-JJM` | `service_lanhostd` | `YES` | `FILE /tmp/lanhostd_boot` | `NONE` | `-1` | `/usr/bin/lanhostd -m 0 -f 0 -t 1` |
| `B9-JJM` | `service_lcm-adapter` | `YES` | `RULE_COMPLETED,service_cfgmgr,service_cthulhu` | `RESTART` | `-1` | `/usr/bin/lcm-adapter` |
| `B9-JJM` | `service_ledmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ledmgr` |
| `B9-JJM` | `service_msgmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/msgmgr -s` |
| `B9-JJM` | `service_ndk_appsd` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr` | `REBOOT` | `-1` | `/sbin/ndk_appsd` |
| `B9-JJM` | `service_ndk_evtmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_evtmgr` |
| `B9-JJM` | `service_ndk_ramond` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/sbin/ndk_ramond` |
| `B9-JJM` | `service_ndktimer` | `YES` | `NONE` | `RESTART` | `-1` | `/usr/bin/ndk_timer` |
| `B9-JJM` | `service_ndk_wand` | `YES` | `RULE_COMPLETED service_msgmgr service_ndk_xiptmgr service_ndk_evtmgr service_ndk_appsd` | `REBOOT` | `-1` | `/sbin/ndk_wand` |
| `B9-JJM` | `service_ndk_xiptmgr` | `YES` | `NONE` | `RESTART` | `-1` | `/sbin/ndk_xiptmgr` |
| `B9-JJM` | `service_nokia-api` | `YES` | `RULE_COMPLETED service_cfgmgr service_ubus_session` | `NONE` | `-1` | `/usr/bin/load_app -r OperatorID=BWDS,BGGL -- /usr/bin/nokia-api` |
| `B9-JJM` | `service_nuspd` | `NO` | `NONE` | `RESTART` | `-1` | `/sbin/nuspd` |
| `B9-JJM` | `service_obuspa` | `YES` | `FILE /tmp/obuspaStart` | `RESTART` | `-1` | `/sbin/obuspa -v 1 -r /etc/uspfactory_reset.conf -l syslog` |
| `B9-JJM` | `service_premeshctl` | `NO` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/bin/sh /usr/bin/premeshctl.sh` |
| `B9-JJM` | `service_raccess` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/raccess` |
| `B9-JJM` | `service_rlyeh` | `YES` | `FILE /tmp/uspRawAdded` | `RESTART` | `-1` | `/usr/bin/run_rlyeh.sh` |
| `B9-JJM` | `service_rpcd` | `YES` | `FILE /tmp/.boot.finish /var/run/ubus-session/ubus.sock` | `RESTART` | `-1` | `/sbin/rpcd -t 30` |
| `B9-JJM` | `SECURITY_SERVICES` | `YES` | `NONE` | `NONE` | `-1` | `/sbin/secInit.sh` |
| `B9-JJM` | `service_srmf` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/srmf` |
| `B9-JJM` | `service_swmgnt` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/load_app -d InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable=true -- /usr/bin/swmgnt` |
| `B9-JJM` | `service_syncmgr` | `YES` | `RULE_COMPLETED service_cfgmgr` | `RESTART` | `-1` | `/usr/bin/syncmgr` |
| `B9-JJM` | `service_system_init` | `YES` | `NONE` | `NONE` | `-1` | `/bin/sh /usr/bin/system_init.sh` |
| `B9-JJM` | `service_timingila` | `YES` | `RULE_COMPLETED service_rlyeh` | `NONE` | `-1` | `/usr/bin/timingila -D` |
| `B9-JJM` | `service_tr069` | `YES` | `FILE /tmp/tr069client_enabled` | `RESTART` | `-1` | `tr069client -d /configs/tr069_conf` |
| `B9-JJM` | `service_ubus_session` | `YES` | `RULE_COMPLETED service_system_init` | `RESTART` | `-1` | `/sbin/ubusd -s /var/run/ubus-session/ubus.sock` |
| `B9-JJM` | `service_uplinkmgr` | `YES` | `FILE /tmp/evtmgr_ready` | `NONE` | `-1` | `/usr/bin/uplinkmgr` |
| `B9-JJM` | `service_uva` | `YES` | `RULE_COMPLETED service_cfgmgr service_ubus_session` | `RESTART` | `-1` | `/sbin/uva -u appService` |
| `B9-JJM` | `service_wanlived` | `YES` | `RULE_COMPLETED service_cfgmgr` | `NONE` | `-1` | `/usr/bin/wanlived` |
| `B9-JJM` | `service_web` | `YES` | `FILE /etc/httpd.conf` | `RESTART` | `-1` | `/webs/thttpd -u appService -dd /webs -C /etc/httpd.conf` |
| `B9-JJM` | `service_wifi_sched` | `YES` | `RULE_COMPLETED service_msgmgr` | `RESTART` | `-1` | `/usr/sbin/sched > /dev/console` |
| `B9-JJM` | `service_wifihostd` | `YES` | `RULE_COMPLETED service_dbmgr` | `NONE` | `-1` | `/usr/bin/wifihostd > /dev/console` |
| `B9-JJM` | `service_wifimon` | `YES` | `FILE /tmp/start_wifimon.txt` | `RESTART` | `-1` | `/usr/sbin/wifimond` |
| `B9-JJM` | `service_wlancli` | `YES` | `NONE` | `NONE` | `-1` | `/usr/bin/wlancli setWpsDaemon` |
| `B9-JJM` | `service_xmppc` | `YES` | `FILE /tmp/xmppc_enable` | `RESTART` | `-1` | `/usr/bin/xmppc /configs/xmpp/xmpp.conf` |
