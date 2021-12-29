#!/bin/bash

source .env.keyspaces

HOSTNAME=cassandra.eu-central-1.amazonaws.com
PORT=9142
VERSION=v_3

echo $SSL_CERTFILE

# cqlsh.py ${HOSTNAME} ${PORT} -u $KEYSPACE_USER -p $KEYSPACE_PWD -f ${VERSION}/99_check_data.cql --ssl 

# checks
echo ""
echo "check DATA from ${HOSTNAME} with Version ${VERSION}"
echo ""
cqlsh.py ${HOSTNAME} ${PORT} -u $KEYSPACE_USER -p $KEYSPACE_PWD -f ${VERSION}/99_check_data.cql --ssl 