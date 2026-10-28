#! /bin/sh
# the system will execute this script ,then run other pcd script.
# user commands

AniNum=$(hcfgtool get ANI.NUMS)
for i in $(seq 1 $AniNum)
do
	OnuType=$(hcfgtool get ANI.$(($i - 1)).TYPE)
	case $OnuType in
		PON)
			ifconfig gpon0 up
			;;
		ENET)
			ifconfig eth0 up
			;;
		*)
			ifconfig eth0 up
	esac
done

if [ -e "/tmp/wifi_reloaded" ]
then
	rm /tmp/wifi_reloaded
fi

# your command must be before the command below 
touch /tmp/system_inited


OPID=$(ritool dump | grep Operator | tail  -c 5)
                                                
if [ $OPID = "BGGL" ]; then
    echo "BGGL insmod ecm_pcc_test.ko"
    insmod ecm_pcc_test.ko      
echo "add default rule to match any rule"
echo "ipv4_default/1/2/0/00:00:00:00:00:00/0.0.0.0/0/00:00:00:00:00:00/0.0.0.0/0/127" > /sys/kernel/debug/ecm_pcc_test/rule
echo "ipv6_default/1/2/0/00:00:00:00:00:00/00::00/0/00:00:00:00:00:00/00::00/0/127" > /sys/kernel/debug/ecm_pcc_test/rule 
else                      
    echo "not inmod ecm_pcc_test.ko"
fi

echo 0 > /proc/sys/dev/nss/pppoe/br_accel_mode

/usr/exe/commandConf.sh /usr/etc/commandConf.yaml

# change below for upgrading image as normal user like appService
touch /tmp/lock/fw_printenv.lock
chmod g+w /tmp/lock/fw_printenv.lock

# change below for tr0698 client to access ubus daemon
chown root:appService /var/run/ubus/ubus.sock /var/run/ubus.sock
chmod g+rw,o-w /var/run/ubus/ubus.sock /var/run/ubus.sock

#session ubus daemon
mkdir -p /var/run/ubus-session

#zeroman direcotry
if [ ! -d /configs/zeroman ]; then
    mkdir -p /configs/zeroman/2/content
    mkdir -p /configs/zeroman/3/content
    mkdir -p /configs/zeroman/4/content
    mkdir -p /configs/zeroman/5/content
    chgrp appService /configs/zeroman -R
    chmod g+w /configs/zeroman -R
fi

