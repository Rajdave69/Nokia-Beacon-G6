# Upgrade-lock research and hermetic tests

The user-facing installer and scripts remain in [the tutorial](../../../../tutorials/disable-firmware-upgrades/README.md). Development evidence is retained here:

- `collect-stock-evidence.py` / `stock-control-evidence.json`: stock-source and isolated original-UCI evidence.
- `test-lock.py`: temporary path-mapped shell fixtures with mocked mount, umount, UCI, identity and logging commands.
- `test-results-hjl.json` / `test-results-ijl.json`: nine original cases per build, eighteen in total.

The records cover install/idempotence, sourced includes, simulated reboot/reapply, removal, pending edits, in-flight upgrade markers, unknown builds and failed/foreign/symlink binds. They do not establish live reboot or real bind-mount behavior. The test harness now locates production scripts through the repository root; the production scripts themselves were not moved or changed. See the [complete knowledgebase](../../../../knowledgebases/firmware-upgrade-disable.md).
