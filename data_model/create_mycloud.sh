#!/bin/bash

HOSTNAME=mycloud
VERSION=v_2

cqlsh.py ${HOSTNAME} -f ${VERSION}/01_lane_type.cql
cqlsh.py ${HOSTNAME} -f ${VERSION}/02_heat_data_table.cql
cqlsh.py ${HOSTNAME} -f ${VERSION}/03_heat_ids.cql
cqlsh.py ${HOSTNAME} -f ${VERSION}/04_base_data.cql
cqlsh.py ${HOSTNAME} -f ${VERSION}/05_base_data.cql

# checks
echo ""
echo "check DATA from ${HOSTNAME} with Version ${VERSION}"
echo ""
cqlsh.py ${HOSTNAME} -f ${VERSION}/99_check_data.cql