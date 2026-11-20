# Storage and flash layouts

HomeOS runs on products with different storage hardware. The same-looking settings or bank names do not imply the same partition map, filesystem or recovery procedure.

- [Beacon G6: NAND, UBI and filesystems](beacon-g6.md) follows the captured HomeOS 24.02 and 24.04 layouts, physical partitions, volumes and dump coverage.
- [Beacon 9: eMMC, GPT and filesystems](beacon-9.md) follows the captured HomeOS 25.03 layout and its separate boot and data partitions.

The XS-2426X-A ONT's captured HomeOS 24.03 layout shares the G6's 512 MiB NAND geometry and twelve-partition physical layout; its captured contents and extraction limits are described in the [G6 layout](beacon-g6.md#each-firmware-bank-is-a-ubi-image) and [ONT comparison](../xs2426xa-24-03-comparison/README.md). Do not transfer partition numbers or commands to another product without checking its own map.
