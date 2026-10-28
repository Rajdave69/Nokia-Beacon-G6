#!/bin/sh

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

backup_DeepWhiteList()
{
	src=$1
	if [ "X$src" = "Xlogs" ]; then
		dst="configs"
	else
		dst="logs"
	fi
	whiteList=$(/usr/exe/json_paser FactoryResetParams.FactoryResetDeepWhiteList < /etc/HB_Config.json)
	for file in $whiteList; do
		root_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $1}')
		if [ "X$root_dir" != "X$src" ]; then
			continue
		fi
		[ -e $file ] && cp -rf $file /$dst/
	done
	sync
}

restore_DeepWhiteList()
{
	src=$1
	if [ "X$src" = "Xlogs" ]; then
		dst="configs"
	else
		dst="logs"
	fi
	whiteList=$(/usr/exe/json_paser FactoryResetParams.FactoryResetDeepWhiteList < /etc/HB_Config.json)
	for file in $whiteList; do
		root_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $1}')
		file_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $2}')
		if [ "X$root_dir" != "X$src" ]; then
			continue
		fi
		[ -e /$dst/$file_dir ] && cp -rf /$dst/$file_dir /$src/ && rm -rf /$dst/$file_dir
	done
	sync
}

backup_NormalWhiteList()
{
	src=$1
	if [ "X$src" = "Xlogs" ]; then
		dst="configs"
	else
		dst="logs"
	fi
	List=$(/usr/exe/json_paser FactoryResetParams.FactoryResetNormalWhiteList < /etc/HB_Config.json)
	for file in $List; do
		root_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $1}')
		if [ "X$root_dir" != "X$src" ]; then
			continue
		fi
		[ -e $file ] && cp -rf $file /$dst/
	done
	sync
}

restore_NormalWhiteList()
{
	src=$1
	if [ "X$src" = "Xlogs" ]; then
		dst="configs"
	else
		dst="logs"
	fi
	List=$(/usr/exe/json_paser FactoryResetParams.FactoryResetNormalWhiteList < /etc/HB_Config.json)
	for file in $List; do
		root_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $1}')
		file_dir=$(echo $file | sed -e 's/\// /g' | awk '{print $2}')
		if [ "X$root_dir" != "X$src" ]; then
			continue
		fi
		[ -e /$dst/$file_dir ] && cp -rf /$dst/$file_dir /$src/ && rm -rf /$dst/$file_dir
	done
	sync
}

remove_ExtraBlackList()
{
	List=$(/usr/exe/json_paser FactoryResetParams.FactoryResetExtraBlackList < /etc/HB_Config.json)
	for item in $List; do
		rm -rf $item
	done
}

factory_back_default()
{
	default_logs2tmp
    cfg_partition=`/usr/sbin/fw_printenv -n cfg_partition`
	UBIDIR_CFGLOG_LIST="$cfg_partition:configs log:logs"
	UBIDIR_CFGOPT_LIST="$cfg_partition:configs log:logs user_data:opt"
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
	if [ $RESET_FLAG -eq 1 ]; then
		echo "[`date '+%F.%T%z'`]MSG: factory default reset ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
		for list in $UBIDIR_CFGLOG_LIST; do
			dir=$(echo $list |cut -d: -f 2)
			backup_DeepWhiteList $dir
			backup_NormalWhiteList $dir
			echo "[`date '+%F.%T%z'`]MSG: Factory reset clear $dir ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
			rm -rf /$dir/*
			restore_DeepWhiteList $dir
			restore_NormalWhiteList $dir
		done
		remove_ExtraBlackList
		echo "[`date '+%F.%T%z'`]MSG: factory default reset completed!" |tee -a /tmp/${LOGDEFAULT} &>/dev/console
	elif [ $RESET_FLAG -eq 2 ]; then
		echo "[`date '+%F.%T%z'`]MSG: deep factory default reset ..." |tee -a /tmp/${LOGDEFAULT} &>/dev/console
		for list in $UBIDIR_CFGOPT_LIST; do
			dir=$(echo $list | cut -d: -f 2)
			mtd=$(echo $list | cut -d: -f 1)
			backup_DeepWhiteList $dir
			format_partition $mtd
			restore_DeepWhiteList $dir
		done
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
