#! /bin/bash

CHAT_ID="-1001725503298"
BOT_TOKEN=5479701203:AAE9-RAdSL8uRjSdlSdMuWtUKHg0aJF3lvU


L="------------------------------------------------------"
Log=$(git log -n 1 --pretty=format:"<b>COMMITER</b>: %cN %n<b>DATE</b>: %ci %n<b>MESSAGE</b>: %s")
Server="<b>Server</b>: VPS-01%0A<b>IP</b>: 66.29.152.204%0A"
MSG="${L}%0A<b>PROJECT</b>: MCLINIC%0A<b>APPLICATION</b>: LARAVEL API%0A<b>STATUS</b>:  Failed%0A<b>VERSION</b>: ${BUILD_NUMBER}%0A${L}%0A${Log}%0A${L}%0A${Server}%0A${L}"



if [ -z "${Log}" ]; then
    echo "String is empty"
    else
    curl -s -X POST https://api.telegram.org/bot${BOT_TOKEN}/sendMessage -d chat_id=${CHAT_ID} -d text="${MSG}" -d parse_mode="HTML"
fi
