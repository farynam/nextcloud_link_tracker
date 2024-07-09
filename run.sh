#!/bin/bash

podman run \
-e CONFIG_HOME=/myapps/conf \
-e CONFIG_FILE=config.json \
-e DATA_HOME=/myapps/data \
-e CRON_FILE=cron.conf \
-v ./volumes/conf/:/myapps/conf \
-v ./volumes/data/:/myapps/data \
--network=host \
--name link_tracker \
--userns=keep-id:uid=1000,gid=1000 \
next-cloud-link-tracker:last