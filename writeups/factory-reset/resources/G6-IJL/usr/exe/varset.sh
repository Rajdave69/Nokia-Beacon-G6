#!/bin/sh

## -----------------------------------------------------------------------------
export UBIMKVOL=/usr/sbin/ubimkvol
export UBIATTACH=/usr/sbin/ubiattach
export UBIDETACH=/usr/sbin/ubidetach
export UBIFORMAT=/usr/sbin/ubiformat
export UBIBLOCK=/usr/sbin/ubiblock
export UBIDEVCTL=/dev/ubi_ctrl

## -----------------------------------------------------------------------------
export LOGDEFAULT=.default.log
export BAKDEFAULT=.default.bak
export TAGUBIFSWR=.tag.ubifswr

export BACKDIR=/opt/.backup
export SYSLOGS=/logs/messages
export BACKUPROOTFSINFO=/tmp/.backup.buildinfo
export IMGUPGINFO=/tmp/.new.image.info
export RSTBUTTONPRESSFLAG=/tmp/.reset_button_press_flag

export UPGRADELOG=/logs/.upgrade.log
export UPGRADELOGBAK=/logs/.upgrade.bak

export CONFIGS_OVERLAY=/configs/overlay

## -----------------------------------------------------------------------------

uenv_get()
{
    key=$1
    cmd="/usr/sbin/fw_printenv -n $key"
    loop=0; while [ $loop -le 9 ]; do
        value=$($cmd)
        echo "[`date '+%F.%T%z'`]MSG: $0 - $cmd = $value @ $loop" |tee -a $SYSLOGS &>/dev/console
        if [ ! -z "$value" ]; then echo $value; return 0; fi
        loop=$(( $loop + 1 ))
    done
    echo 0; return 1
}

uenv_set()
{
    key=$1
    value=$2
    cmd="/usr/sbin/fw_setenv $key $value"
    loop=0; while [ $loop -le 9 ]; do
        $cmd; sync
	retVal=$(/usr/sbin/fw_printenv -n $key)
        echo "[`date '+%F.%T%z'`]MSG: $0 - $cmd = $retVal @ $loop" |tee -a $SYSLOGS &>/dev/console
        if [ "X$value" = "X$retVal" ]; then return 0; fi
        loop=$(( $loop + 1 ))
    done
    return 1
}

# 1 means upgrade, 0 means no upgrade
is_upgrade()
{
    sb_num=$(/usr/sbin/fw_printenv -n sb_flag)
    let "sb_data=sb_num & 0x88"

    if [ $sb_data -eq 128 -o $sb_data -eq 8 ];then
        echo "1"
    else
        echo "0"
    fi
}

