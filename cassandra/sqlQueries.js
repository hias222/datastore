
const insertheatquery = 'INSERT INTO colorado.heatdata \
(heatid, lastid, event, heat, creation_date, lanes, name, swimstyle, competition, distance, gender, relaycount, round) \
 VALUES (?, ?, ?, ?, toTimeStamp(now()), ?, ?, ?, ?, ?, ?, ? ,?)';

const insertheatid = 'INSERT INTO colorado.heatids \
    (wkid,creation_date, heatid ) \
        VALUES (?,toTimeStamp(now()), ?)';

const updateheatid = 'UPDATE colorado.heatdata \
        SET \
	    nextid= ? \
        WHERE heatid=?';

const selectlastheatid = 'SELECT heatid, creation_date, wkid \
        FROM colorado.heatids \
        LIMIT 1';
// where wkid= ? \

const searchHeatId = 'SELECT heatid, lastid, nextid, event, heat, \
    creation_date, lanes, name, swimstyle, competition, distance, \
    gender, relaycount, round FROM colorado.heatdata where heatid = ? LIMIT 10';

module.exports = {
        insertheatquery,
        insertheatid,
        updateheatid,
        selectlastheatid,
        searchHeatId
}