# Next Cloud link tracker
Simple cron based notification for NextCloud. 
It uses database directly for queries. Also it saves state in order to narrow notifications results.
Notification is for Nextcloud resources such as:
- calendars
- files 
- forms

## Requirements
- docker or podman with podman-compose installed (preffred is podman but you can easily turn it to docker)


## Build
```
    $ ./build_image_docker.run
```    
or
```
    $ ./build_image_podman.run
```

## configuration
Positions with * are optional.
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

## How to run it
### Without container
It will just notify and exit.
```
  $ node i 
  $ node src/app/index.mjs
```

### Via podman or docker directly
look at run.sh in the project dir.


### Via podman/docker compose
Basically run the script below.

1.Get yourself a SMTP server
2.Configure SMTP in ./volumes/conf/config.json
3.Run
```
  $ podman-compose -f podman-compose.yml up
```
2. go to http://localhost:8081 and configure nextcloud
3. Launch some email client and configure 
4. Try to update/add calendars, files, forms

## Tested for versions
- Nextcloud Hub 8 (29.0.1)
- podman version 4.3.1
- podman-composer version  1.0.3
- Debian GNU/Linux 12 (it should work on other platforms)

## Notification format

```
Current shares:
{
  "calendarShares": [],
  "fileShares": [
    {
      "owner": "resource owner email",
      "resource": "resource name",
      "link": "link to the resource",
      "updated": "resource update time"
    }
  ],
  "formShares": []
}
```

## Directories

```
|-.devcontainer
    |-certs (additional CA to import)
    |-conf 
        |-.docker (build config for docker-in-docker VSC plugin)
        |-docker (docker daemon config for docker-in-docker VSC plugin)
    |-dev_host (image etc conf files to overwrite)
|-build (main dir for scripts and other artificats to build final image)
    |-certs (additional CA to import)
    |-out (image output dir)
    |-scripts (image runtime scripts)
|-config (config files - config_example.json,cron_example.json for details)
|-example (example queries)
|-run (directory with a state file)
|-src
```