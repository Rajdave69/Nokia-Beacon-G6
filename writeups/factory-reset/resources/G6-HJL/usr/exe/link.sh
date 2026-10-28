#!/bin/sh
#### deal with the link.cfg with general strategy
#for item in $(cat /usr/cfg/link.cfg |sed "s/[ \t]//g" |sed "s/^#.*$//g")
#         echo MSG: will copy upgrade keep default files

. /usr/exe/varset.sh


link_after_overlay()
{
    List=$(/usr/exe/json_paser OverlayParams.OverlayPersistentFileList < /etc/HB_Config.json)
    for file in $List
    do
        LINK_TARGET=$file
        LINK_SOURCE=$CONFIGS_OVERLAY/$file
        if [ -e ${LINK_SOURCE} ]; then
            continue
        elif [ -e /rom/${LINK_TARGET} ]; then
            mkdir -p $(dirname ${LINK_SOURCE})
            cp -rf /rom/${LINK_TARGET} $(dirname ${LINK_SOURCE})
        else
            mkdir -p $(dirname ${LINK_SOURCE})
            echo MSG: No ${LINK_SOURCE} &>/dev/console
        fi
    done
}

link_before_overlay()
{
    List=$(/usr/exe/json_paser OverlayParams.OverlayPersistentFileList < /etc/HB_Config.json)
    for file in $List
    do
        LINK_TARGET=/tmp/root/upper/$file
        LINK_SOURCE=$CONFIGS_OVERLAY/$file
        mkdir -p $(dirname ${LINK_TARGET})
        ln -sf ${LINK_SOURCE} ${LINK_TARGET}
    done
}

