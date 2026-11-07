# Recovered ECD REST registrations

The table is the complete recovered G6 HJL static initializer set; IJL has exactly the same method/path pairs. Every row is pinned to the native registration and callback in the adjacent JSON. Only the version/topology GETs were queried live. All other rows describe registrations, not a completed payload schema, safety classification, permission contract or live control guarantee.

| Method | Path | HJL callback | Verification scope |
| --- | --- | --- | --- |
| GET | `/1/admin-blacklist` | `0x1284e8` | Registration only; handler semantics incomplete |
| PUT | `/1/admin-blacklist` | `0x1286a8` | Registration only; handler semantics incomplete |
| GET | `/1/aps/*/*/*/*/*/*/*/*` | `0x1375e0` | Registration only; handler semantics incomplete |
| GET | `/1/log-config` | `0x15df58` | Registration only; handler semantics incomplete |
| PUT | `/1/log-level` | `0x15e9d8` | Registration only; handler semantics incomplete |
| PUT | `/1/log-path` | `0x15fab8` | Registration only; handler semantics incomplete |
| GET | `/1/topology` | `0x162140` | HTTP200 live, cached read |
| GET | `/1/version` | `0x162eb0` | HTTP200 live, cached read |
| GET | `/debug/ap_capabilities` | `0x12d3e8` | Registration only; handler semantics incomplete |
| GET | `/debug/ap_metrics_data` | `0x156c48` | Registration only; handler semantics incomplete |
| POST | `/debug/ap_metrics_query` | `0x155bf8` | Registration only; handler semantics incomplete |
| POST | `/debug/ap_remove` | `0x13b098` | Registration only; handler semantics incomplete |
| GET | `/debug/aps` | `0x13cb60` | Registration only; handler semantics incomplete |
| GET | `/debug/backhaul-steer` | `0x142a58` | Registration only; handler semantics incomplete |
| PUT | `/debug/backhaul-steer` | `0x141a30` | Registration only; handler semantics incomplete |
| GET | `/debug/backhaul-steer-enable` | `0x1426d8` | Registration only; handler semantics incomplete |
| PUT | `/debug/backhaul-steer-enable` | `0x143020` | Registration only; handler semantics incomplete |
| POST | `/debug/backoff_state` | `0x1494c0` | Registration only; handler semantics incomplete |
| POST | `/debug/bouncing_thd` | `0x14b510` | Registration only; handler semantics incomplete |
| POST | `/debug/bsteer_decision_chance` | `0x14a5b8` | Registration only; handler semantics incomplete |
| POST | `/debug/bsteer_decision_window` | `0x14a348` | Registration only; handler semantics incomplete |
| POST | `/debug/btm_disassoc_timer` | `0x14c4a8` | Registration only; handler semantics incomplete |
| GET | `/debug/cac_data` | `0x146a18` | Registration only; handler semantics incomplete |
| GET | `/debug/cac_request` | `0x1384d0` | Action GET; not queried |
| GET | `/debug/cac_termination` | `0x138730` | Action GET; not queried |
| POST | `/debug/ch_scan_policy` | `0x157df8` | Registration only; handler semantics incomplete |
| GET | `/debug/ch_scan_report` | `0x139430` | Registration only; handler semantics incomplete |
| GET | `/debug/ch_scan_request` | `0x13a088` | Action GET; not queried |
| GET | `/debug/configdb` | `0x14e318` | Registration only; handler semantics incomplete |
| PUT | `/debug/configdb` | `0x14d7e8` | Registration only; handler semantics incomplete |
| GET | `/debug/context` | `0x1603a8` | Registration only; handler semantics incomplete |
| PUT | `/debug/current-op-channel` | `0x1434e8` | Registration only; handler semantics incomplete |
| GET | `/debug/dynamic-backhaul-band-switch` | `0x14fa58` | Registration only; handler semantics incomplete |
| PUT | `/debug/dynamic-backhaul-band-switch` | `0x14e5b8` | Registration only; handler semantics incomplete |
| GET | `/debug/dynamic-backhaul-band-switch-enable` | `0x14f820` | Registration only; handler semantics incomplete |
| PUT | `/debug/dynamic-backhaul-band-switch-enable` | `0x14f280` | Registration only; handler semantics incomplete |
| POST | `/debug/ewma_policy` | `0x157c48` | Registration only; handler semantics incomplete |
| POST | `/debug/free_roaming_state` | `0x149748` | Registration only; handler semantics incomplete |
| POST | `/debug/free_roaming_threshold` | `0x14ca80` | Registration only; handler semantics incomplete |
| POST | `/debug/free_roaming_time` | `0x14c790` | Registration only; handler semantics incomplete |
| GET | `/debug/fronthaul-management` | `0x150250` | Registration only; handler semantics incomplete |
| PUT | `/debug/fronthaul-management` | `0x1505f8` | Registration only; handler semantics incomplete |
| POST | `/debug/global_steer_state` | `0x149000` | Registration only; handler semantics incomplete |
| GET | `/debug/graph` | `0x154980` | Registration only; handler semantics incomplete |
| POST | `/debug/idle_steer_state` | `0x149c10` | Registration only; handler semantics incomplete |
| POST | `/debug/idle_threshold` | `0x14c148` | Registration only; handler semantics incomplete |
| GET | `/debug/map-cfg` | `0x15a9d0` | Registration only; handler semantics incomplete |
| POST | `/debug/min_safe_rssi_2g` | `0x14a898` | Registration only; handler semantics incomplete |
| POST | `/debug/msteer_2g_rssi` | `0x14b9f0` | Registration only; handler semantics incomplete |
| POST | `/debug/msteer_5g_rssi` | `0x14b780` | Registration only; handler semantics incomplete |
| POST | `/debug/multi_ap_steer_state` | `0x1499d0` | Registration only; handler semantics incomplete |
| POST | `/debug/nva_steering` | `0x14b018` | Registration only; handler semantics incomplete |
| GET | `/debug/nvamgmt` | `0x15ccc8` | Registration only; handler semantics incomplete |
| POST | `/debug/ping_pong` | `0x149e98` | Registration only; handler semantics incomplete |
| POST | `/debug/ping_pong_check_2g` | `0x14ad90` | Registration only; handler semantics incomplete |
| POST | `/debug/ping_pong_check_5g` | `0x14ab08` | Registration only; handler semantics incomplete |
| POST | `/debug/ping_pong_offset_cal` | `0x14a0d8` | Registration only; handler semantics incomplete |
| POST | `/debug/port_state` | `0x154460` | Registration only; handler semantics incomplete |
| POST | `/debug/roaming_back_check` | `0x14d3a8` | Registration only; handler semantics incomplete |
| POST | `/debug/roaming_margin` | `0x14d0c0` | Registration only; handler semantics incomplete |
| PUT | `/debug/rrm_en` | `0x14cd70` | Registration only; handler semantics incomplete |
| POST | `/debug/rssi_threshold_dbm` | `0x14bc60` | Registration only; handler semantics incomplete |
| POST | `/debug/single_ap_steer_state` | `0x149280` | Registration only; handler semantics incomplete |
| POST | `/debug/steer_sys_reset` | `0x148168` | Registration only; handler semantics incomplete |
| POST | `/debug/steering` | `0x148988` | Registration only; handler semantics incomplete |
| POST | `/debug/steering_cat` | `0x14b2a0` | Registration only; handler semantics incomplete |
| GET | `/debug/unassoc-metrics` | `0x156228` | Registration only; handler semantics incomplete |
| PUT | `/debug/unassoc-metrics` | `0x1572d8` | Registration only; handler semantics incomplete |

## Additional Beacon 9 registrations

| Method | Path | JJM callback |
| --- | --- | --- |
| PUT | `/debug/bh-rrm-threshold` | `0x15a638` |
| PUT | `/debug/bh-nb-age-time` | `0x15aaf0` |
| PUT | `/debug/rrm_threshold` | `0x1668a8` |

## Separately constructed HJL server utility routes

Native constructor `0x120400` uses registration helper `0x120138`, with method in x1. These five method/path pairs are not counted in the 68 initializer registrations. Handler semantics/availability remain untested; none was queried.

| Method | Path | Register call |
| --- | --- | --- |
| GET | `/quit` | `0x120478` |
| GET | `/debug/rest` | `0x1204ec` |
| OPTIONS | `/debug/rest` | `0x120558` |
| GET | `/debug/query` | `0x1205cc` |
| GET | `/debug/array` | `0x120640` |

A GET can initiate work or terminate a server. Do not derive a read-only collector by crawling this catalogue. The exact utility construction traces remain in the complete private evidence inventory.
