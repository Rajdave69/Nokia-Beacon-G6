#!/bin/sh
#we need to follow one rule 
#we need to add the count and background variable in the script
set -x

if [ $# -lt 1 ];then
	echo "no enough parameters"
	echo " usage:"
	echo "post_script.sh mount/driver/app"
	exit 1
fi

prefix=$1

if [ ! -f "/configs/${prefix}_post_script.sh" ];then
	echo "the post_script.sh is not exit , do not need to do anything byebye!"
	exit 1
fi

count=`cat /configs/${prefix}_post_script.sh |grep  count |awk -F "=" '{print $2}'`
background=`cat /configs/${prefix}_post_script.sh |grep background|awk -F "=" '{print $2}'`

if [ -z "$count" -o -z "$background" ];then
	echo "the script lost the count or background value"
	exit 1
fi

launch_script()
{
      chmod +x /tmp/${prefix}_post_script.sh
	if [ "$background" = 0 ];then
		/sbin/saferun /tmp/${prefix}_post_script.sh &
	else
		/sbin/saferun /tmp/${prefix}_post_script.sh
	fi
}

	cp -rfd /configs/${prefix}_post_script.sh /tmp/
if [ "$count" = 0 ];then
	rm -rf /configs/${prefix}_post_script.sh 
	chmod 755 /tmp/${prefix}_post_script.sh
	launch_script
	echo "run once ${prefix}_post_script.sh >> /logs/reboot.log"

elif [ "$count" -gt 0 -a "$count" -lt 100 ];then
	if [ -f "/configs/${prefix}_post_script_count" ];then
		count=`cat /configs/${prefix}_post_script_count|grep count|awk -F "=" '{print $2}'`
	fi
	
	if [ "$count" != 0 ];then
		launch_script
		let count-=1
		echo "count=$count" > /configs/${prefix}_post_script_count
		echo "run $count times ${prefix}_post_script.sh >> /logs/reboot.log"
	else
		rm -rf /configs/${prefix}_post_script.sh
		rm -rf /configs/${prefix}_post_script_count
		echo "run done the ${prefix}_post_script.sh >> /logs/reboot.log"
	fi
else
	launch_script
	date >> /logs/reboot.log
	echo "run again the ${prefix}_post_script.sh >> /logs/reboot.log"
fi
