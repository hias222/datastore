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

### SQS

SQS connects with IAM user

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

connect with csql

```bash
export SSL_CERTFILE=sf-class2-root.crt
cqlsh cassandra.eu-central-1.amazonaws.com 9142 -u "<generated-keyspace-useranme>" -p "<generated-keyspace-password>" --ssl --ssl_context PROTOCOL_TLSv1_2
```

keyspaces connects with seperate user, configured with iam console

datacenter
 use system;
select data_center from local;

KEYSPACE=colorado
CONTACTPOINT=cassandra.eu-central-1.amazonaws.com
CONTACTPOINT_PORT=9142
LOCALDATACENTER='eu-central-1'
SSLCONNECT=aws
CASSANDRA_USER=co..
CASSANDRA_PASSWORD=cl..