# Channel request: static follow-up

This follow-up resolves the queue-to-worker gap recorded in the first ECD investigation. It is specific to the hash-pinned G6 HJL binaries. No command was executed on a router, no firmware was emulated and no configuration was changed.

`evidence.json` retains the exact queue header, dispatch proof,52-byte request layout,12-byte reply layout, gates and RAM-default correction. Native windows and calls preserve every inspected instruction; `trace-index.json` pins source/ranges/hashes. `worker-opcode-table.json` decodes all25 jump-table entries. The earlier parent `channel-dispatch-proof.json` remains an unchanged historical record: its empty direct callback-to-worker list is still correct because the path is queued; its unresolved-routing qualification is superseded here.

The completion object uses `socketpair(1,5,0)`: local Unix sequenced-packet sockets, not a TCP listener or named socket. The queue sends an internal eight-byte message pointer; D-Bus clients still send serialized request bytes. The worker copies output into the shared internal result buffer and returns its separate status through a four-byte completion message.

The three default setters update the ordinary168-byte `g_default_channel_cfg` RAM object in24-byte records. Their names did not establish persistence. This does not prove that the whole channel request is RAM-only or that it successfully changes hardware.

The prefix before the band field is36 bytes, interpreted as a NUL-terminated MAC string. Its exact source declaration and padding capacity are not recovered. The field at44 is bandwidth, not transmit power; the field at48 is the reason, with its low byte copied internally. Some exploratory field hypotheses were corrected against the native format-string argument order. Bandwidth/reason meanings, physical band labels and downstream hardware/persistence behavior still need investigation. No ready-to-run setter is supplied from an incompletely understood ABI.

Run offline from the project root:

```sh
python3 writeups/easymesh-management/resources/channel-path/validate.py
```

The validator checks original source hashes, every retained instruction byte, opcode5 jump-table arithmetic, critical request/reply loads, the consumer/worker/apply calls, the RAM object symbol and all48 private originals. Private mapping/source profiles and the shared G6 alias helper are required. An imported `get_current_time` symbol has no local body; its empty exploratory trace is retained privately and excluded from native-code claims. No test here demonstrates live channel switching, restore behavior or cross-build ABI equivalence.
