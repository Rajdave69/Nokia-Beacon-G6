# Phase-hook research probes

The user-facing preparation tool and example remain in [the tutorial](../../../../tutorials/use-stock-phase-hooks/README.md). These four C sources are development probes from the isolated saferun investigation: `saferun-probe.c`, `saferun-restrictions-probe.c`, `saferun-status-probe.c` and the fail-closed `unused-crypt.c` shim.

Earlier QEMU experiments called original G6/B9 functions with command execution intercepted, and isolated stock-BusyBox dispatcher fixtures modeled counters and branches. These sources are not runtime dependencies for preparing or installing a phase hook. Their bytes are unchanged by this move. The [complete phase-hook knowledgebase](../../../../knowledgebases/startup-phase-hooks.md) retains the exact experiments, outcomes and untested live behavior.
