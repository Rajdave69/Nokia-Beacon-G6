wdt dev watchdog@0xf432901c
wdt stop
setenv mtdids 'nand0=ca_nand_flash'
setenv mtdparts 'mtdparts=ca_nand_flash:4M@0x0(ssb),2M(uboot-env),1M(RI),80M(rootfs0),80M(rootfs1),30M(rootfs_data0),30M(rootfs_data1),8M(cfg),15M(log),5M(extfs),1M(0:ART),256M(user_data)'
ubi part rootfs0
ubi read 0x10000000 fit
setenv bootargs 'cnss2.bdf_pci0=0xa0 cnss2.bdf_pci1=0xa1 earlycon=serial,0xf4329188 serial_is_dis=0 console=ttyS0,115200 ubi.mtd=rootfs0 ubi.block=0,1 root=/dev/ubiblock0_1 rootfstype=squashfs rootwait ro init=/bin/sh'
setenv bootargs ${bootargs} ${mtdparts}
bootm 0x10000000
