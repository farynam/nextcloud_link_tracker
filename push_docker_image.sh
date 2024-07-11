#!/bin/bash

VERSION="1.0.0"
DOMAIN="docker.io"
REPO="farynam"
NAME="next-cloud-link-tracker"
FULL_NAME="${DOMAIN}/${REPO}/${NAME}:${VERSION}"
LAST_NAME="${DOMAIN}/${REPO}/${NAME}:last"
CONF_DIR="$(pwd)/.devcontainer/conf"
PROXY_FILE="${CONF_DIR}/proxy/anon_proxy.sh"
export REGISTRY_AUTH_FILE="${CONF_DIR}/podman/auth.json"

if [ -f "${PROXY_FILE}" ]; then
    source "${PROXY_FILE}"
fi

echo "Using:"
echo "HTTP_PROXY:${HTTP_PROXY}"
echo "HTTPS_PROXY:${HTTPS_PROXY}"

podman login  "${DOMAIN}"


podman push "${FULL_NAME}"
#podman push "${LAST_NAME}"
