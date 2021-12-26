# Datastore

## cassandra

docker run --name cassandra -p 7000:7000 -p 9042:9042 -d cassandra  

--network localhost
-Dcassandra.config=/path/to/cassandra.yaml  
docker exec -it cassandra bash

## cqlsh

docker run -it --rm cassandra cqlsh cassandra

from mac
brew install cassandra
cqlsh --> connects to localhost docker

## Docker

```bash
# start local docker

docker build -t datastore .

docker login
docker tag datastore hias222/datastore:0.1.0
docker push hias222/datastore:0.1.0

DEST_MQTT_HOST
docker run -p 4001:4001 datastore
docker images
```

## MQQT

### AWS

```bash
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
docker run --name=datastore -p 4001:4001 --rm -e SRC_MQTT_MODE=SQS -e AWS_ACCESS_KEY_ID=123 -e AWS_SECRET_ACCESS_KEY=123 displaysocket
```

Settings for AWS
SRC_MQTT_MODE=SQS
SRC_CHANNEL_NAME=storechannel
QUEUE_URL=https://sqs.eu-central-1.amazonaws.com/654384432543

### keyspaces

datacenter
 use system;
select data_center from local;