FROM mcr.microsoft.com/devcontainers/typescript-node:dev-22-bookworm

ARG DIR_MY_CERTS=mycerts
ARG MY_CERTS=/usr/share/ca-certificates/$DIR_MY_CERTS
ARG USER_BINARIES_DIR="/usr/local"
ARG NODE_OPTIONS="--use-openssl-ca"
ARG USER=node
ENV SSL_CERT_FILE=/pki/all.crt

ENV TMP_DIR=$TMP_DIR


ENV NODE_OPTIONS=$NODE_OPTIONS

#set up apt to use proxy
COPY ./dev_host/. /.

RUN mkdir -p $TMP_DIR $MY_CERTS \
    && mkdir /pki \
    && mkdir -p /home/$USER/.docker

COPY ./certs/* $MY_CERTS/
COPY ./certs/* /pki/
COPY ./conf/.docker/config.json /home/node/.docker/config.json

RUN for cert in $(ls -1 $MY_CERTS); do cat $MY_CERTS/${cert} >>  $SSL_CERT_FILE ; done \
    && ls -1 /pki \
#for root
    && npm config set cafile $SSL_CERT_FILE

#Install app here
RUN apt-get update \
    && apt-get install -y \
    sed \
    curl


RUN chmod -R g+r $MY_CERTS/* \
    && chmod -R o+r $MY_CERTS/* \
    && chown -R node:node /pki


#Copy certs here
RUN for cert in $(ls -1 $MY_CERTS); do echo "${DIR_MY_CERTS}/$(basename ${cert})" >> /etc/ca-certificates.conf ; done \
    && update-ca-certificates

RUN chown -R $USER:$USER /home/$USER/.docker


RUN apt-get install -y git

#for repositories in devcontainers docker
COPY ./conf/docker/daemon.json /etc/docker/

USER node
#for npm to download required libs for user
RUN npm config set cafile /pki/all.crt

RUN env

RUN export SSL_CERT_FILE=/pki/all.crt