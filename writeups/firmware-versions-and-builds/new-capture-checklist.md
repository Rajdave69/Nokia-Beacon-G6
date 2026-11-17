# Adding another G6 to the comparison

Use a separate directory under the ignored `dumped-firmware/` folder, keeping the dump's
original filenames and hashes. The existing dump tutorial remains the starting
point. These details make a newer capture useful even when its WebUI only
shows a shortened software version.

- Preserve both firmware banks and the shared bootloader/environment, RI and
  EXTFS captures. The inactive bank can contain the distinct build we need.
- Keep the live `/etc/buildinfo` and `/etc/openwrt_release`, captured boot
  command line and partition map. Record which bank was actually running.
- Record factory OperatorID and CountryID with the read-only `ritool get`
  commands, plus the actual LAN MAC if preparing an OTA profile later.
- Note any owner modifications: startup hooks, runtime overlays, account
  changes, UART environment and boot-password overrides.
- Record ONTUSER presence before adding any account-modifying hook. This
  read-only check does not print shadow hashes:

```sh
if grep -q '^ONTUSER:' /etc/passwd; then echo 'ONTUSER: present'; else echo 'ONTUSER: absent'; fi
```

The original package metadata and matching `cfgmgr` binary let us distinguish a
functional creator from a stub. Keep the exact build's libraries as well; an
older helper's ABI and fixed code offsets must not be assumed compatible with
a newer release. Factory material, exports and keys remain in the project's
private capture locations.

Manufacturing date, selected bank, Linux image and shared bootloader are
separate facts. A new physical unit is not automatically a new firmware build.
No new unit has been assigned a firmware version in the catalogue yet.
