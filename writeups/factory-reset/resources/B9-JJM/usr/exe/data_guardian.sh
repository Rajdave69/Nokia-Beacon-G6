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
