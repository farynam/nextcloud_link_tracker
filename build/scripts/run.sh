#!/bin/bash
printenv | grep -v no_proxy | grep -v root >> /etc/environment


. /myapps/conf/${CRON_FILE}


CRON_JOB=${CRON_JOB:="*/15 * * * *"}

{ cat;  echo "${CRON_JOB} /myapps/scripts/run_node.sh 1>/proc/1/fd/1 2>/proc/1/fd/2" ; } | crontab -

echo "starting cron"

cron -f -L 2 
