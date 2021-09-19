/* 
      01_lane_type.cql
*/

CREATE KEYSPACE IF NOT EXISTS colorado
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

drop TABLE if exists colorado.heatdata;
drop TYPE if exists colorado.lane;
