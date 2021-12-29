/*
  99_chack_data.cql
*/

select heatid,event,heat,lastid from colorado.heatdata LIMIT 10;
SELECT heatid, creation_date, wkid FROM colorado.heatids LIMIT 10;