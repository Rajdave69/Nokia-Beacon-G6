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

export BACKDIR=/backup/.backup
export RESETBACKDIR=/backup/.reset_backup
export SYSLOGS=/logs/messages
export BACKUPROOTFSINFO=/tmp/.backup.buildinfo
export IMGUPGINFO=/configs/.to.upg.info
export RSTBUTTONPRESSFLAG=/tmp/.reset_button_press_flag

export UPGRADELOG=/logs/.upgrade.log
export UPGRADELOGBAK=/logs/.upgrade.bak
export LOGSDIR=/logs
export CONFIGSDIR=/configs
export BACKUPDIR=/backup
export OPTDIR=/opt
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

get_board_flash_type()
{
        if [ ! -e "/sys/block/mmcblk0" ];then
                echo nand
        else
                echo emmc
        fi
}

