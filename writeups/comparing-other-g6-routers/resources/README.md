# Comparison evidence and reproduction resources

The [single writeup](../README.md) compares all four G6 captures. The [single knowledgebase](../../../knowledgebases/comparing-other-g6-routers.md) owns complete continuation context. The [evidence bundle](../../../knowledgebases/comparing-other-g6-routers-evidence.json) preserves the full former records under second_device_and_builds, third_device and fourth_device, rather than embedding copies in Markdown.

| Resources | Original scope |
| --- | --- |
| stored-db-native-trace.txt; stored-db-decryption-validation.json; stored-db-cross-device-validation.json | Third-unit stored-format breakthrough and cross-device real-file checks. |
| carve-ubifs-leads.py; validate-carver.py; carver-validation.json | CRC-checked log-node carving and bounded synthetic validation. |
| inspect-fourth-g6.py; initial-comparison.json; compare-volumes.py; volume-payload-comparison.json | Fourth capture, bank and bootloader comparison. |
| extract-writable.py; writable-extraction.json; compare-writable.py; writable-comparison.json | Fourth writable filesystems, databases and service-key comparisons. |
| collect-log-context.py; log-context.json | Fourth-unit retained logs/provisioning/sandbox context. |
| validate-fourth-g6.py; validation-results.json | Historical full source/decode/link/privacy validation. |

Resources are flat so their existing parents[3] project-root calculation remains correct. Current consumers select their original record from the combined evidence JSON. Historical source hashes continue to refer to the exact pre-consolidation bytes in private archives when a tool was adjusted; they are not silently relabeled as hashes of the edited tool.

The two-G6 reproduction notes link to the shared helpers beside their corresponding writeups. WebUI backup helpers remain in webui/scripts/. No crypto, rootfs, provisioning or account algorithm changed in this documentation reorganization. Relocation verification covers resource-byte preservation, parser/import/path checks, evidence retention and links; it does not rerun old native, router, decrypt/import or boot experiments.
