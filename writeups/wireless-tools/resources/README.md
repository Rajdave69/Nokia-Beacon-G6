# Wireless tool evidence

- `profile-comparison.json`: all17 tool paths across3saved profiles, presence/length/hash, complete wrapper text, all9 vendor XML originals and structured command definitions.
- `xml-name-differences.json`: exact per-file name additions/removals. Names alone do not establish equal ABI or implementation.
- `live-captures.json`: complete normalized stdout/status; real MAC/SSID values use shared opaque aliases. Raw/hex originals remain private. Scripts record actual scope; the USSA getter guard skipped its body because timeout was unavailable.
- `retained-evidence.json`: all24 complete private originals, including native utility inventories. Captures are not authority to execute every command they mention.
- `writeups/internal-ubus-management/resources/wireless-followup` in the companion writeup tree retains the18 new exact native windows, channel layout, band/width tables and JSON envelope; see the main writeup's link.

Offline verification from the project root:

```sh
python3 writeups/wireless-tools/resources/validate.py
```

The validator requires Capstone, original saved sources and the ignored alias registry. It checks51 tool sources,9 XML sources/projections,8 fresh live hash matches, native byte ranges, complete private captures and identifier redaction. The Beacon9 copy resolves the shared G6 alias helper if absent locally. No target firmware is executed during validation.

No setter, scan, WPS/DFS/spectral test, counter reset, restart, persistent edit or router file transfer occurred. Live driver and hostapd status are separate observations; no over-the-air or calibrated-power measurement was made.
