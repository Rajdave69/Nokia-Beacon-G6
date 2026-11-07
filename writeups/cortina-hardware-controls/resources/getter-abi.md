# Original SDK getter ABI, offline-verified

Payload excludes the four-byte header. These are original HJL copies; IJL results are separate. Status14 is CA_E_EXISTS, not ordinary success. Synthetic marker bytes are not hardware values.

| SDK function | HJL opcode | Payload bytes | Copied output bytes |
| --- | ---: | ---: | ---: |
| `ca_eth_port_link_status_get` | 36 | 12 | 4 |
| `ca_eth_port_speed_get` | 47 | 12 | 4 |
| `ca_eth_port_duplex_get` | 51 | 12 | 4 |
| `ca_eth_port_autoneg_get` | 40 | 12 | 4 |
| `ca_eth_port_phy_autoneg_get` | 42 | 12 | 4 |
| `ca_eth_port_link_scan_get` | 35 | 12 | 4 |
| `ca_eth_port_phy_enable_get` | 66 | 12 | 4 |
| `ca_eth_port_phy_speed_get` | 49 | 12 | 4 |
| `ca_eth_port_phy_duplex_get` | 53 | 12 | 4 |
| `ca_eth_port_phy_advert_get` | 44 | 68 | 60 |
| `ca_eth_port_eee_enable_get` | 57 | 12 | 4 |
| `ca_eth_port_phy_eee_enable_get` | 59 | 12 | 4 |
| `ca_eth_port_pause_quanta_get` | 33 | 12 | 2 |
| `ca_eth_port_stats_get` | 37 | 212 | 200 |
| `ca_eth_port_stats_get_ex` | 38 | 420 | 408 |
| `ca_port_enable_get` | 400 | 12 | 4 |
| `ca_port_pvid_vlan_get` | 420 | 12 | 4 |
| `ca_port_pvid_tpid_get` | 422 | 12 | 4 |
| `ca_port_pvid_dot1p_get` | 424 | 12 | 4 |
| `ca_l2_vlan_port_control_get` | 462 | 48 | 40 |
| `ca_port_discard_control_get` | 414 | 24 | 16 |
| `ca_port_tx_traffic_block_get` | 434 | 12 | 4 |
| `ca_port_redirect_get` | 443 | 20 | 12 |
| `ca_port_station_move_get` | 416 | 12 | 4 |
| `ca_port_stp_state_get` | 410 | 12 | 4 |
| `ca_port_shaper_get` | 194 | 24 | 16 |
| `ca_port_policer_get` | 176 | 32 | 24 |
| `ca_port_special_packet_profile_get` | 335 | 12 | 1 |
| `ca_queue_enable_get` | 510 | 16 | 4 |
| `ca_queue_length_get` | 512 | 16 | 4 |
| `ca_queue_shaper_get` | 196 | 28 | 16 |
| `ca_queue_wred_get` | 518 | 140 | 128 |
| `ca_queue_stats_get` | 521 | 48 | 32 |
| `ca_nat_config_get` | 212 | 16 | 12 |
| `ca_l2_vlan_learning_shared_get` | 460 | 8 | 4 |
| `ca_info_get` | 570 | 60 | 56 |
