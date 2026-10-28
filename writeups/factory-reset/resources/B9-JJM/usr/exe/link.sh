#!/bin/sh
#### deal with the link.cfg with general strategy
#for item in $(cat /usr/cfg/link.cfg |sed "s/[ \t]//g" |sed "s/^#.*$//g")
#         echo MSG: will copy upgrade keep default files

. /usr/exe/varset.sh

List=$(/usr/exe/json_paser OverlayParams.OverlayPersistentFileList < /etc/HB_Config.json)
for file in $List
do
        LINK_TARGET=$file
        LINK_SOURCE=$CONFIGS_OVERLAY/$file
        mkdir -p $(dirname ${LINK_SOURCE})
        if [ -e ${LINK_SOURCE} ]; then
            if [ -L ${LINK_TARGET} ]; then
                    rm -f ${LINK_TARGET}
            else
                    rm -rf ${LINK_TARGET}
        fi
        elif [ -e ${LINK_TARGET} ]; then
            mv ${LINK_TARGET} ${LINK_SOURCE}
        else
            echo MSG: No ${LINK_SOURCE}
        fi
        ln -sf ${LINK_SOURCE} ${LINK_TARGET}
done
