# Running a small application through the stock G6 manager

The successful fixture was downloaded, installed, started, stopped and removed on a G6 running `3FE49996HJLL91 / HJL.L91p01`, HomeOS `24.04.00`, on 2026-10-28. This procedure records that experiment; writing it on 2026-10-29 did not repeat any router operation. Beacon 9 installation remains untested.

The application is a static AArch64 executable which writes a marker in its container's `/tmp` and sleeps. It opens no sockets and handles TERM, INT and PWR. The router keeps its stock kernel, drivers and rootfs. Its manager does write application state under `/opt/lcm` and its normal configuration/log locations.

Read [the outcome and failed attempts](evidence.json) before repeating this on another router. The first malformed fixture left an orphaned DU and Rlyeh exited during cleanup; its exact exit mechanism was not established. The corrected fixture is attempt 3. This is a reproducible research procedure, not an unattended fleet installer.

## Preconditions and identity

Use an existing authorized root shell and a private registry address reachable from the router. The experiment used the owner's existing TCP2323 shell. It did not establish access using the WebUI alone. The physical G6-A/B/C/D alias of the tested unit was not supplied.

Before an installation, record the actual build and manager state:

```sh
id -u
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|HOMEOSVERSION|BUILDDATE)=' /etc/buildinfo
sha256sum /usr/bin/lcm /usr/bin/lcm-adapter /usr/lib/amx/cthulhu/cthulhu.so /usr/lib/librlyeh.so
ubus call SoftwareModules.ExecEnv.1 _get '{"depth":0}'
ubus call Rlyeh _get '{"depth":0}'
ubus call SoftwareModules.DeploymentUnit _get '{"depth":1}'
ubus call SoftwareModules.ExecutionUnit _get '{"depth":1}'
```

The tested G6 already had `CertificateVerification=false` and `SignatureVerification=false`. Neither was changed. The self-signed registry below depends on that measured state. For a router with certificate verification enabled, use a certificate it already trusts and the matching registry hostname. Beacon 9 reports certificate verification enabled; this procedure is not a demonstrated Beacon 9 installation route.

Use an unused app UUID and inventory baseline. This fixture's generated app UUID is `e5d244c9-af3e-5224-96c0-76ca4ae7290a`; do not install over an existing application with that UUID.

## Build and validate on the workstation

Run from this directory in a Linux environment with Python 3, an AArch64 Linux cross-compiler, matching strip tool and QEMU user-mode AArch64:

```sh
WORK=$(mktemp -d)
python3 build_package.py --out "$WORK/package"
python3 verify_package.py --package "$WORK/package" --out "$WORK/validation.json"
qemu-aarch64 "$WORK/package/lcm-smoke" --self-test
```

The self-test should print `beacon-lcm-smoke self-test ok` and return 0. The validator checks the four blob descriptors, sizes, SHA-256 values, uncompressed layer `diff_ids`, tar member paths/types, static AArch64 ELF, runtime selection, tag/version equality and mount destinations. It neither connects to a registry nor proves router acceptance.

Two offline rebuilds on 2026-10-29 exactly matched the retained successful ELF, compressed layers, runtime/image/manifest JSON and OCI index/layout. [offline-validation.json](offline-validation.json) records the toolchain. Different toolchains may produce different ELF/layer digests; the generated manifest must describe the actual bytes being served.

## Serve only the test package

Set `REGISTRY_IP` to the workstation's private LAN IPv4 address, not a publication alias. This command prepares a short-lived test-only certificate; do not reuse a production key:

```sh
REGISTRY_IP='<workstation-LAN-IPv4>'
openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
  -keyout "$WORK/registry.key" -out "$WORK/registry.crt" \
  -subj '/CN=beacon-lcm-smoke' -addext "subjectAltName=IP:${REGISTRY_IP}"
python3 registry_server.py --bind "$REGISTRY_IP" --port 443 \
  --package "$WORK/package" --cert "$WORK/registry.crt" --key "$WORK/registry.key" \
  --log "$WORK/registry-access.jsonl" --stop-file "$WORK/registry.stop"
```

Keep this server in its own terminal and record `WORK` for cleanup from a second terminal. Binding port 443 may require local privileges; local firewall rules must permit the router. The server offers GET/HEAD for this single image's manifest/blobs and `/v2/`; it provides no push or directory listing. An existing stop-file makes it refuse to start.

The fixed repository is `beacon-lcm-smoke`, with tag **0.0.1**. The manifest's image version and OCI index reference are also **0.0.1**. The first attempt used `smoke-v1` for the registry tag while declaring `0.0.1`; Cthulhu could not find that version in the local index. Serving a tag called `latest` does not establish compatibility with the tested install path.

## Install without automatic startup

On the router, set the same registry address and application UUID:

```sh
REGISTRY_IP='<workstation-LAN-IPv4>'
APP_UUID='e5d244c9-af3e-5224-96c0-76ca4ae7290a'
lcm install -i "$APP_UUID" -l "https://${REGISTRY_IP}/beacon-lcm-smoke:0.0.1" -a 0
ubus call SoftwareModules.DeploymentUnit _get '{"depth":1}'
ubus call SoftwareModules.ExecutionUnit _get '{"depth":1}'
ubus call Cthulhu.Container.Instances _get '{"depth":1}'
```

`Message sent` and CLI exit 0 acknowledge submission, not asynchronous completion. Repeat the getters after a short interval until the matching DU is `Installed` and its EU is `Idle`, or stop on an error. Getters emit a stream of JSON objects, including trailing status objects; whole-stdout `json.loads` is insufficient.

Find the DU whose `UUID` equals `APP_UUID`, then correlate its `DUID`, name/version and the EU's `EUID`. The DU's `ExecutionUnitList` was empty in our capture even though an EU existed. The observed DUID/EUID/container ID was `717afa32-49ae-5e01-bccd-1426268a18ff`, but verify the current value instead of assuming it. Attempt 3 used DU index 3, EU index 2 and container instance 3; earlier retries had different indices.

## Start and verify completion

Set `EU_ID` to the value just observed:

```sh
EU_ID='<observed-EUID>'
lcm start -e "$EU_ID"
ubus call SoftwareModules.ExecutionUnit _get '{"depth":1}'
ubus call Cthulhu.Container.Instances _get '{"depth":1}'
lxc-info -n "$EU_ID"
```

Expect the EU to reach `Active`, Cthulhu to reach `Running` and LXC to report `RUNNING`. A brief `Starting` model value while the actual process already runs was observed. With the current PID obtained from `lxc-info`, inspect only this app's marker and process:

```sh
LCM_PID=$(lxc-info -n "$EU_ID" -pH)
case "$LCM_PID" in ''|*[!0-9]*) echo 'No running app PID';; *)
  cat "/proc/$LCM_PID/root/tmp/beacon-lcm-smoke.started"
  grep -E '^(Name|State|NSpid|Uid|Gid|CapEff|NoNewPrivs):' "/proc/$LCM_PID/status"
  readlink "/proc/$LCM_PID/ns/net"
  readlink /proc/1/ns/net
esac
```

BusyBox `readlink` accepts one file per invocation here. The PID shown in historical evidence is not valid for reuse. A native `lxc-attach` self-test printed success, but the interactive console transport lost its trailing receipt, so that invocation's exit status is unknown. If using attach later, feed stdin from `/dev/null` or use a noninteractive transport; the procedure above does not need attach.

## Understand the effective runtime

The successful image includes empty mount destinations `/tmp`, `/run`, `/proc`, `/sys`, `/sys/fs/cgroup`, `/dev/pts`, `/dev/shm`, `/etc`, `/persistent-data` and `/temporary-data`. It supplies no explicit runtime mounts and relies on the stock tmpfs defaults for `/tmp` and `/run`. The runtime annotation selects a gzip tar layer containing `config.json`, separate from the image-config blob. Both layers are prepared into the app rootfs.

The adapter additionally supplies `/opt/lcm/persistent-data/<APP_UUID>` at `/persistent-data` and host `/tmp` at `/temporary-data`, even with no requested host objects. The app did not touch those injected paths. Its `/tmp` marker was in the separate container tmpfs.

The requested memory limit of 16 MiB became both EU `AllocatedMemory=16384` kilobytes and cgroup `memory.limit_in_bytes=16777216`. Requested CPU quota/period `10000/100000` became `AllocatedCPUPercent=10`, then actual quota/period `40000/100000` on four CPUs. The backend scales this percentage to host CPU capacity.

Requested empty capabilities, `noNewPrivileges=true` and a network namespace were not all enforced by this path. The running app was UID/GID 0, `CapEff=0000003fffffffff`, `NoNewPrivs=0`, sharing the host network namespace. This fixture demonstrates execution; its generic OCI fields do not establish a production isolation policy.

## Stop, remove and close the temporary registry

```sh
lcm stop -e "$EU_ID"
lxc-info -n "$EU_ID"
ubus call SoftwareModules.ExecutionUnit _get '{"depth":1}'
```

Wait for `STOPPED` / `Idle` before uninstalling:

```sh
lcm uninstall -i "$APP_UUID" -r 0
ubus call SoftwareModules.DeploymentUnit _get '{"depth":1}'
ubus call SoftwareModules.ExecutionUnit _get '{"depth":1}'
ubus call Cthulhu.Container.Instances _get '{"depth":1}'
lxc-ls --fancy
ubus call Cthulhu.Sandbox.Instances _get '{"depth":1}'
ubus call SoftwareModules.ExecEnv.1 _get '{"depth":0}'
ubus call Rlyeh _get '{"depth":0}'
```

Wait for this app's real DU/EU/container objects and LXC entry to disappear. The G6 CLI's old blank placeholder row is not an installed app. In our cleanup, transient sandbox 2/3 list paths remained, while final `_get` contained only generic sandbox 1, `Up`; no forced sandbox deletion was needed.

`-r 0` sent `RetainData=false`, but left an **empty** app persistent-data directory. Inspect it; if it contains only `.` and `..`, `rmdir "/opt/lcm/persistent-data/$APP_UUID"` can remove the empty directory. Do not recursively erase uninspected paths. Test nonempty retention separately if needed. The app root, image layout and four tested prepared layers were absent at final cleanup. Normal manager history/logs remained; this was not a byte-for-byte filesystem rollback.

On the workstation, in the second terminal with the same `WORK`, stop the server:

```sh
: > "$WORK/registry.stop"
```

Wait for `test registry stopped`. Keep keys, logs and raw receipts private. The actual experiment already completed this cleanup; the app and registry are not waiting for a future session.

## What remains untested

Beacon 9 installation, enabled-signature enforcement, the TLS rejection matrix, app updates, nonempty data retention, autostart/reboot and firmware-bank persistence remain untested. AdGuard deployment additionally needs an explicit DNS/listen-port, data and network plan. No WebUI-only installer or general network-facing LCM API has been verified.

[Structured outcome](evidence.json), [exact historical fixtures](fixtures.json), [complete normalized captures](normalized-captures.json) and [hash-pinned private source inventory](retained-evidence.json) retain the evidence. Published endpoint/timestamp aliases resolve only through the ignored private mapping; they are not literal command inputs.

## Validate the retained evidence

```sh
python3 validate_evidence.py
python3 validate_evidence.py --private-sources
```

The first command checks the public normalized captures against the outcome and cleanup claims. The second additionally verifies all 113 private original file fingerprints, exact normalization roundtrips and absence of private identifiers/test TLS-key bytes in this publication directory. It requires the ignored mapping and original G6 captures; the companion project uses the shared G6 alias helper. [documentation-validation.json](documentation-validation.json) retains the successful result. Neither command connects to a router or registry.
