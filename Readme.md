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