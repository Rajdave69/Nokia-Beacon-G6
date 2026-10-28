#!/bin/sh

. /lib/functions.sh
. /lib/uboot-envtools.sh
. /usr/exe/varset.sh

BARDEFAULT=15000
default_logs2tmp()
{
	if [ ! -e /logs/${LOGDEFAULT} ]; then
		return
	fi
	SIZDEFAULT=$(ls -l /logs/${LOGDEFAULT} 2>/dev/null | sed "s/[!\t][ \t]*/ /g" | cut -d" " -f5)
	if [ "0${SIZDEFAULT}" -ge ${BARDEFAULT} ]; then
		mv -f /logs/${LOGDEFAULT} /logs/${BAKDEFAULT}
	else
		cat /logs/${LOGDEFAULT} /tmp/${LOGDEFAULT} > /tmp/${LOGDEFAULT}.tmp
		mv -f /tmp/${LOGDEFAULT}.tmp /tmp/${LOGDEFAULT}
	fi
	if [ -f /logs/${BAKDEFAULT} ]; then
		mv -f /logs/${BAKDEFAULT} /tmp/${BAKDEFAULT}
	fi
}

default_tmp2logs()
{
	if [ -f /tmp/${BAKDEFAULT} ]; then mv -f /tmp/${BAKDEFAULT} /logs/${BAKDEFAULT}; fi
	if [ -f /tmp/${LOGDEFAULT} ]; then mv -f /tmp/${LOGDEFAULT} /logs/${LOGDEFAULT}; fi
}

default_uboot_env () {
	UBOOTENV_PART=$(cat /proc/mtd | grep APPSBLENV)
	mtd_dev=$(echo $UBOOTENV_PART | awk '{print $1}' | sed 's/:$//')
	mtd_erase=0x$(echo $UBOOTENV_PART | awk '{print $3}')

	# size is hardcoded to 0x40000 in u-boot
	uboot_env_size=0x40000
	sectors=$(( $uboot_env_size / $mtd_erase ))

	echo /dev/$mtd_dev 0x0 $uboot_env_size $mtd_erase $sectors
}

config_ubootenv()
{
	[ ! -e /etc/config/ubootenv ] && {

		touch /etc/config/ubootenv

		env=$(default_uboot_env)
		[ -n "${env}" ] && ubootenv_add_uci_config $env

		config_load ubootenv
		config_foreach ubootenv_add_app_config ubootenv
	}
}

format_partition()
{
	ubi_part=$1
	echo "[`date '+%F.%T%z'`]MSG: format partition $ubi_part ..." | tee -a /tmp/${LOGDEFAULT} &>/dev/console

	ubi_part_id=$(cat /proc/mtd |grep "\<${ubi_part}\>"|head -n 1 |cut -d: -f1 |cut -c4-)
	ubi_port=$(mount |grep /dev/ubi$ubi_part_id |cut -d' ' -f3)
	echo "CMD: umount ${ubi_port}"
	umount -l ${ubi_port} &>/dev/null
	echo "CMD: $UBIDETACH $UBIDEVCTL -m ${ubi_part_id}"
	$UBIDETACH $UBIDEVCTL -m ${ubi_part_id} &>/dev/null
	echo "CMD: $UBIFORMAT /dev/mtd${ubi_part_id} -y"
	$UBIFORMAT /dev/mtd${ubi_part_id} -y &>/dev/null
	echo "CMD: $UBIATTACH $UBIDEVCTL -m ${ubi_part_id} -d ${ubi_part_id}"
	ubi_part_info=$($UBIATTACH $UBIDEVCTL -m ${ubi_part_id} -d ${ubi_part_id} 2>/dev/null)
	ubi_part_lebs=$(echo "${ubi_part_info}" |sed "s/^.*\(total\)\(.*\)\(LEBs\).*\(available\).*/\2/" |sed "s/[ \t\n]//g")
	ubi_part_aleb=$(echo "${ubi_part_info}" |sed "s/^.*\(available\)\(.*\)\(LEBs\).*/\2/" |sed "s/[ \t\n]//g")
	ubi_lebs_size=$(echo "${ubi_part_info}" |sed "s/^.*\(LEB size\).*\(bytes (\)\(.*\)\( KiB\).*/\3/" |sed "s/[ \t\n]//g" |cut -d. -f1)
	echo "MSG: ${ubi_part_info}"
	echo "MSG: ubi_part=${ubi_part} ubi_part_lebs=${ubi_part_lebs} ubi_part_aleb=${ubi_part_aleb}"
	## Volume Size = Total - Total/32(Reserved for BEB) - 4(Reserved for Volume)
	## ubi_part_aleb=$((${ubi_part_aleb} - 4)) ## Reserved only for more tolerance
	ubi_vols_lebs=$((${ubi_part_lebs} * 31 / 32 - 4))
	if [ ${ubi_part_aleb} -lt ${ubi_vols_lebs} ]; then ubi_vols_lebs=${ubi_part_aleb}; fi
	ubi_vols_size=$((${ubi_vols_lebs} * ${ubi_lebs_size}))
	echo "MSG: ubi_part=${ubi_part} ubi_vols_lebs=${ubi_vols_lebs} ubi_lebs_size=${ubi_lebs_size} ubi_vols_size=${ubi_vols_size}"
	mdev -s &>/dev/null

	## try to make volume for the ${ubi_part}
	echo "CMD: $UBIMKVOL /dev/ubi${ubi_part_id} -t dynamic -n 0 -N ${ubi_part} -s ${ubi_vols_size}KiB"
	$UBIMKVOL /dev/ubi${ubi_part_id} -t dynamic -n 0 -N ${ubi_part} -s ${ubi_vols_size}KiB &>/dev/null
	if [ $? != 0 ]; then reboot; fi    #reboot and try again
	mdev -s &>/dev/null

	## try to mount the ${ubi_part}
	echo "CMD: mount -t ubifs /dev/ubi${ubi_part_id}_0 ${ubi_port}"
	mount -t ubifs /dev/ubi${ubi_part_id}_0 ${ubi_port} &>/dev/null

	echo "[`date '+%F.%T%z'`]MSG: format partition $ubi_part done" | tee -a /tmp/${LOGDEFAULT} &>/dev/console
}

backup_files()
{
    listName=$1
	whiteList=$(/usr/exe/json_paser FactoryResetParams.$listName < /etc/HB_Config.json)
	for file in $whiteList; do
        file_dir=$RESETBACKDIR/$(dirname $file)
		if [ -e $file ]; then
           [ ! -e $file_dir ] && mkdir -p $file_dir
           cp -rf $file $file_dir
        fi
	done
	sync
}

restore_files()
{
    listName=$1
	whiteList=$(/usr/exe/json_paser FactoryResetParams.$listName < /etc/HB_Config.json)
	for file in $whiteList; do
        src_file=$RESETBACKDIR/$file
        dst_dir=$(dirname $file)
		if [ -e $src_file ]; then
           [ ! -e $dst_dir ] && mkdir -p $dst_dir
           cp -rf $src_file $dst_dir && rm -rf $src_file
        fi
	done
	sync
}


backup_DeepWhiteList()
{
    backup_files "FactoryResetDeepWhiteList"
}

restore_DeepWhiteList()
{
    restore_files "FactoryResetDeepWhiteList"
}

backup_NormalWhiteList()
{
    backup_files "FactoryResetNormalWhiteList"
}

restore_NormalWhiteList()
{
    restore_files "FactoryResetNormalWhiteList"
}

remove_ExtraBlackList()
{
	List=$(/usr/exe/json_paser FactoryResetParams.FactoryResetExtraBlackList < /etc/HB_Config.json)
	for item in $List; do
		rm -rf $item
	done
}

clear_directory()
{
    echo "remove all files in $1" > /dev/console
    find $1 -maxdepth 1 -mindepth 1 | xargs rm -rf
}

factory_back_default()
{
	default_logs2tmp
	loop=0; while [ $loop -le 9 ]
	do
		RESET_FLAG=`/usr/sbin/fw_printenv -n factory_reset_flag`
		if [ ! -z "${RESET_FLAG}" ]; then break; fi
		echo "[`date '+%F.%T%z'`]ERR: get factory_reset_flag but failed $loop times ..." |tee -a /tmp/$LOGDEFAULT &>/dev/console
		sync; mdev -s &>/dev/null
		loop=$(( $loop + 1 ))
	done
	if [ -z "${RESET_FLAG}" -a $loop -ge 9 ]; then
		RESET_FLAG=0
		echo "[`date '+%F.%T%z'`]ERR: get factory_reset_flag timeout, assigned as 0" |tee -a /tmp/$LOGDEFAULT &>/dev/console
	fi
	echo "[`date '+%F.%T%z'`]MSG: RESET flag $RESET_FLAG" |tee -a /tmp/${LOGDEFAULT} &>/dev/console
    [ ! -e $RESETBACKDIR ] && mkdir -p $RESETBACKDIR 
	if [ $RESET_FLAG -eq 1 ]; then
		echo "[`date '+%F.%T%z'`]MSG: factory default reset ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
        backup_DeepWhiteList
        backup_NormalWhiteList
        echo "[`date '+%F.%T%z'`]MSG: Factory reset clear $dir ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
        clear_directory  $LOGSDIR
        clear_directory  $CONFIGSDIR
        restore_DeepWhiteList
        restore_NormalWhiteList
        clear_directory  $BACKUPDIR
		remove_ExtraBlackList
		echo "[`date '+%F.%T%z'`]MSG: factory default reset completed!" |tee -a /tmp/${LOGDEFAULT} &>/dev/console
	elif [ $RESET_FLAG -eq 2 ]; then
		echo "[`date '+%F.%T%z'`]MSG: deep factory default reset ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
        backup_DeepWhiteList 
        clear_directory  $LOGSDIR
        clear_directory  $CONFIGSDIR
        clear_directory  $OPTDIR
        restore_DeepWhiteList 
        clear_directory  $BACKUPDIR
		echo "[`date '+%F.%T%z'`]MSG: deep factory default reset completed!" |tee -a /tmp/${LOGDEFAULT} &>/dev/console
	fi
	loop=0; while [ $loop -lt 9 ]
	do
		/usr/sbin/fw_setenv factory_reset_flag 0
		sync; loop=$(( $loop + 1 ))
		if [ "X"`/usr/sbin/fw_printenv -n factory_reset_flag` = "X0" ]; then break; fi
		echo "[`date '+%F.%T%z'`]ERR: factory-default set flag to 0 but failed $loop times ..." |tee -a /tmp/$LOGDEFAULT &>/dev/console
	done
	default_tmp2logs
}
