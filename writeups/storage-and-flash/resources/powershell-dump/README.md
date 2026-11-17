# PowerShell dump development tests and evidence

The runnable Windows dumper and usage instructions remain in [the tutorial](../../../../tutorials/dump-firmware/README.MD). This directory contains development-only fixtures and reports.

- `test_powershell_telnet_dump.py`: full-script loopback Telnet integration tests; requires Python and the PowerShell runtimes being tested.
- `powershell-validation-results.json`: the original 42-case Windows PowerShell 5.1 / PowerShell 7 results, pinned to the unchanged dumper hash.
- `validate_powershell_shell_framing.py` and `powershell-shell-framing-results.json`: optional developer-only WSL/POSIX checks of actual emitted commands and fixed-printf framing.

The original tests verified both capture scopes, binary bytes, manifests, ZIP contents, authentication and failure handling. They used synthetic local fixtures, not a live router. Moving these records does not constitute a fresh live-device validation. Repository-root discovery in the two helpers was adjusted for this directory. Full continuation context remains in the [storage knowledgebase](../../../../knowledgebases/storage-and-flash.md).
