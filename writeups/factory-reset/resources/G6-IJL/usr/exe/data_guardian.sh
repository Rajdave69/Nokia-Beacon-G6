#!/bin/sh

. /usr/exe/varset.sh

dynamic_backup_files()
{
	dynamic_backup_list=$(/usr/exe/json_paser DataGuardianParams.DynamicBackupFileList < /etc/HB_Config.json)
	# backup files for every one day
	while [ true ]
	do
		sleep 86400
		for file in $dynamic_backup_list; do
			file_dir=$(dirname $file)
			[ ! -e $BACKDIR/$file_dir ] && mkdir -p $BACKDIR/$file_dir
			cp -rf $file $BACKDIR/$file_dir
		done
		sync
	done
}

static_backup_files()
{
	sleep 120  # wait files ready
	static_backup_list=$(/usr/exe/json_paser DataGuardianParams.StaticBackupFileList < /etc/HB_Config.json)
	for file in $static_backup_list; do
		file_dir=$(dirname $file)
		[ ! -e $BACKDIR/$file_dir ] && mkdir -p $BACKDIR/$file_dir
		cp -rf $file $BACKDIR/$file_dir
	done
	sync
}

backup_files_restore()
{
	for file_root_dir in $(ls -l $BACKDIR | awk '{print $9}'); do
		need_restore=$(/usr/sbin/fw_printenv -n mount_${file_root_dir}_fail)
		if [ $need_restore -eq 1 ]; then
			cp -rf $BACKDIR/$file_root_dir/* $file_root_dir/
			sync
			/usr/sbin/fw_setenv mount_${file_root_dir}_fail 0
			/usr/sbin/fw_setenv mount_$(basename $(dirname $BACKDIR))_fail 0
		fi
	done
}

data_guardian()
{
	backup_files_restore
	static_backup_files &
	dynamic_backup_files &
}

backup_log()
{
    BOARDTYPES=`ritool get Mnemonic | awk -F: '{print $2}'`
    echo "the board is $BOARDTYPES, will backup files in tmp to logs" |tee -a ${SYSLOGS} &>/dev/console

    # unit is KB
    logs_reserve_space=1024

    logs_available_space=$(df -k | grep logs | sed 's/[[:space:]][[:space:]]*/ /g' | cut -d " " -f4)
    if [ $logs_reserve_space -ge $logs_available_space ]; then
        echo "logs available space ${logs_available_space}KB less than reserved ${logs_reserve_space}KB, \
    do not backup files in tmp to logs!" |tee -a ${SYSLOGS} &>/dev/console
    else
        mkdir -p /tmp/reboot
        mkdir -p /logs/history
        log_backup_list=$(/usr/exe/json_paser DataGuardianParams.LogBackupFileList < /etc/HB_Config.json)
        for file in $log_backup_list ;do
            if [ -e $file ]; then
                cp $file /tmp/reboot/ -af
            fi
        done
        cd /tmp/ && tar -zcvf reboot.tar.gz reboot
        cp /tmp/reboot.tar.gz /logs/history/ -af
        echo "$BOARDTYPES : backup files in tmp to logs" |tee -a ${SYSLOGS} &>/dev/console
    fi
}
