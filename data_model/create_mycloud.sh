#!/bin/bash

HOSTNAME=mycloud

cqlsh.py ${HOSTNAME} -f 01_lane_type.cql
cqlsh.py ${HOSTNAME} -f 02_heat_data_table.cql
cqlsh.py ${HOSTNAME} -f 03_heat_ids.cql
cqlsh.py ${HOSTNAME} -f 04_base_data.cql
cqlsh.py ${HOSTNAME} -f 05_base_data.cql