#!/bin/bash

. /etc/environment

export NODE_OPTIONS="--use-openssl-ca"

chown -R node:node /myapps/config /myapps/data 

su - node -c "npm config set cafile /pki/all.crt"
su - node -c "/usr/local/bin/node /myapps/app/index.mjs"
