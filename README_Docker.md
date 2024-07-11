
## Configuration 

### Setup configuration variables
These are environment variables:
- *VERBOSE - true | false show configuration and state on startup.
- DATA_HOME - directory where to store state file. 
- CONFIG_HOME - Directory where to find configuration  
- CONFIG_FILE - Configuration file name without path.
- *NODE_EXTRA_CA_CERTS - extra CA for node if any
- CRON_FILE - file with a cron expression like CRON_JOB="*/1 * * * *"

### *Setup env variables for corporate proxy build
```
export HTTP_PROXY="http://<your corpo proxy address>"
export HTTPS_PROXY="http://<your corpo proxy address>"
export NO_PROXY="<dkip proxy for this domain>"
```

### Setup next_cloud_link_tracker 
```
config/config_example.json:
{
    "//": "start from beginning of the epoch(true) and don't save progress",
    "reportOnly": false,
    "//": "domain where nextcloud is installed",
    "domain": "cloud.example.com",
    "//": "email configuration details",
    "email": {
        "//": "email address which appear in from section of the email",
        "from": "cloud@eaxample.com",
        "//": "email adreess to which notification should be sent",
        "to": "admin@example.com",
        "//": "Email subject give something meaningful",
        "subject": "Nextcloud notification",
        "//": "SMTP configuration",
        "smtp": {
            "//": "SMTP host",
            "host": "smtp.example.com",
            "//": "SMTP port",
            "port": 587,
            "//": "STARTTLS(false) or TLS",
            "secure": false,
            "//": "user",
            "user": "tmcloud@example.com",
            "//": "password",
            "password": "password1"
        }
    },
    "//": "DB connection configuration",
    "db": {
        "//": "DB ip or domain",
        "host": "localhost",
        "//": "DB port",
        "port": 5432,
        "//": "DB user",
        "user": "oc_admin",
        "//": "DB password",
        "password": "password2",
        "//": "DB name",
        "database": "nextcloud"
    },
    "//": "For which type of resource should be listen(FORM, CALENDAR, FILES)",
    "notificationOn" : ["FORM", "CALENDAR", "FILES"]
}
```
## Via docker compose:

```
version: '3.8'

services:
  link_tracker:
    container_name: link_tracker
    image: next-cloud-link-tracker:last
    build:
      dockerfile: ./build/Dockerfile
      context: /build
    restart: always
    userns: "keep-id"
    depends_on:
      - nextcloud_app
    environment:
      - CONFIG_HOME=/myapps/conf
      - CONFIG_FILE=config.json
      - CRON_FILE=cron.conf
      - DATA_HOME=/myapps/data
    volumes:
      - ./volumes/conf/:/myapps/conf/
      - ./volumes/data/:/myapps/data/
  nextcloud_db:
    image: docker.io/postgres:12.13-alpine3.17
    restart: always
    container_name: nextcloud_db
    userns: "keep-id"
    ports:
      - "5432:5432"
    volumes:
      - ./volumes/db/:/var/lib/postgresql/data/
    environment:
      - POSTGRES_PASSWORD=password123
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=oc_admin
    mem_limit: 500m
    mem_reservation: 30M

  nextcloud_app:
    image: docker.io/nextcloud:29.0.1
    restart: always
    container_name: nextcloud_app
    userns_mode: "keep-id"
    depends_on:
      - nextcloud_db
    ports:
      - "8081:80"
    environment:
      - POSTGRES_PASSWORD=password123
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=oc_admin
      - POSTGRES_HOST=nextcloud_db:5432
      - NEXTCLOUD_TRUSTED_DOMAINS=localhost
      - NEXTCLOUD_INIT_HTACCESS=true
      - REDIS_HOST=nextcloud_redis
      - REDIS_HOST_PORT=6379
    volumes:
      - ./volumes/app_nextcloud/:/var/www/html/
      - ./volumes/app_apps/:/var/www/html/custom_apps/
      - ./volumes/app_config/:/var/www/html/config/
      - ./volumes/app_data/:/var/www/html/data/
      - ./volumes/app_certs/:/usr/share/ca-certificates/other/
      - ./volumes/app_themes/:/var/www/html/themes/
    mem_limit: 1G
    mem_reservation: 130M

  nextcloud_redis:
    image: docker.io/webhippie/redis:latest
    container_name: nextcloud_redis
    restart: always
    environment:
      - REDIS_DATABASES=1
    mem_limit: 100m
    mem_reservation: 30M
    healthcheck:
      test: ["CMD", "/usr/bin/healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 5
```

directly:
```
 $ podman run \
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
```