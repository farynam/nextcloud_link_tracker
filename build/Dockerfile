FROM docker.io/node:lts-bullseye
ARG MY_CERTS_DIR=mycerts
ARG MY_CERTS=/usr/share/ca-certificates/$MY_CERTS_DIR
ARG MY_APPS=/myapps/

ENV SCRIPTS_HOME=$MY_APPS/scripts
ENV CONFIG_HOME=$MY_APPS/config
ENV DATA_HOME=$MY_APPS/data
ENV APP_HOME=$MY_APPS/app

ARG NODE_OPTIONS="--use-openssl-ca"
ARG USER=node
ENV TMP_DIR=$TMP_DIR
ENV NODE_OPTIONS=$NODE_OPTIONS


#Install app here
RUN apt-get update \
    && apt-get install -y \
    sed \
    curl \
    cron \
    vim \
    dumb-init

RUN mkdir -p $MY_CERTS $SCRIPTS_HOME $CONFIG_HOME $APP_HOME $DATA_HOME \
    && mkdir /pki

COPY ./build/scripts/* $SCRIPTS_HOME/
COPY ./build/certs/* $MY_CERTS/
COPY ./build/certs/* /pki/
COPY ./src/app/ $APP_HOME/
COPY ./package.json $MY_APPS/

RUN for cert in $(ls -1 $MY_CERTS); do cat $MY_CERTS/${cert} >>  /pki/all.crt ; done \
    && ls -1 /pki


RUN chmod -R g+r $MY_CERTS/* \
    && chmod -R o+r $MY_CERTS/* \
    && chown -R node:node /pki $MY_APPS

#Copy certs here
RUN for cert in $(ls -1 $MY_CERTS); do echo "${MY_CERTS_DIR}/$(basename ${cert})" >> /etc/ca-certificates.conf ; done \
    && update-ca-certificates
    #for root
#    && npm config set cafile /pki/all.crt

USER $USER

WORKDIR $MY_APPS

#for npm to download required libs for user
#RUN npm config set cafile /pki/all.crt
RUN npm i

USER root

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD [ "/myapps/scripts/run.sh" ]

