# Reproducing the key0/key1/key2 consumer checks

These are host-only research resources for the [security-key writeup](../../README.md#the-legacy-defaults-behind-key0-key1-and-key2). They do not connect to a router or install anything on it. The firmware root is read; build products and synthetic expected outputs go into a disposable host temporary directory.

`consumer-map.json` records the resolved roles, exact HJL sites, legacy selectors, source hashes, comparison results and limitations. `native-results.json` contains the five original-library test results. The three trace files retain selected original AArch64 instructions; literal/call annotations are heuristic. The map's original-source hashes identify the exact libraries used.

Run on Linux/WSL with Python cryptography, qemu-aarch64 and aarch64-linux-gnu-gcc installed:

```sh
python3 writeups/security-keys/resources/key012/verify-key012.py \
  --root /path/to/extracted/firmware/root \
  --out /tmp/key012-result.json
```

The supported roots are the recorded modern embedded-key implementations: G6 IJL.J03 and HJL.L91, XS-2426X-A JJL.K67 and KJL.K50, and Beacon 9 JJM.K44. The script verifies that the static entries decode and match bytes in the supplied library before running. That precondition alone does not identify an arbitrary future firmware as compatible; check the source hashes and API layout before extending coverage. Older R21/R23 store-backed implementations are excluded from this native probe because they require a different initialization path; their recorded result is static tracing.

The probe compares the original library against Python-generated expectations for synthetic plaintext `key-role-probe`:

1. AES-256-CBC with null key/IV, expected first32(key0)/first16(key1).
2. The same operation with explicit synthetic key/IV, overriding the defaults.
3. Base64(SHA256(plaintext + first32(key2))) with a null optional suffix.
4. The same hash with explicit suffix `extra`, overriding the default.
5. `SE_getKeyByName` for each exact deprecated name, expecting error 7.

There are four successful crypto comparisons and three rejected-name checks per modern profile. Keys are read into host memory, never printed or written into the test output. The expected file contains synthetic cryptographic results, not key bytes. No security-database initialization, config getter/setter, account creation or networking call is part of the test. The probe aborts standard process-launch and socket entry points. It does not replace the firmware crypto functions with mocks.

G6/ONT use the original glibc/libdl files. Beacon 9 uses the original musl loader and libc. The saved musl ELF lacks section headers, so GNU ld cannot consume it as a link input. `musl-link-stub.c` supplies symbol names at link time and produces a DT_NEEDED dependency named libc.so; it is never supplied in the runtime search path. During QEMU execution, the firmware's original libc.so and crypto libraries resolve those symbols. No stub cryptographic function participates.

Initial setup failures are retained as limitations in the consumer map: wrong dlopen provider when linking against the workstation libc, missing glibc-style files on Beacon 9, and sectionless musl linkage. They were resolved before the final five-profile run and are not counted as passes. No live device, real credential, encrypted database, exported backup or installed-service path was tested by this probe.
