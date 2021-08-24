const cassandraClient = require('./configCassandra')
const { types } = require('cassandra-driver');

const wkid = 1;

function constructor() {
    cassandraClient.client.connect()
        .then(() => logger.info('connected'))
        .catch((data) => logger.error(data));
};


function add(heatdata) {
    return new Promise((resolve, reject) => {
        const Uuid = types.Uuid.random();
        let lastUuid;
        const logg = Uuid + ' e: ' + heatdata.event + ' h: ' + heatdata.heat
        console.log(logg.toString());
        // logger.info(JSON.stringify(heatdata));
        const params2 = [wkid, Uuid]

        cassandraClient.client.connect()
            .then(() =>
                getLastID())
            .then(result => {
                lastUuid = result;
                console.log('last id ' + result + ' new ' + Uuid);
                return insertNewHeatID(heatdata, Uuid, result)
            })
            .then(() => {
                console.log('insertheatid ' + wkid + ' ' + Uuid);
                return cassandraClient.client.execute(insertheatid, params2, { prepare: true })
            })
            .then(() => {
                console.log('update last heat ' + lastUuid)
                updateLastHeatID(lastUuid, Uuid)
            })
            .then(() => resolve({ 'uuid': Uuid }))
            .catch(reason => {
                console.log('failure in add heat')
                console.log(reason)
                //return reject({ 'uuid': Uuid, 'reason': reason })
            })
    })
};

 function getLastID() {
    const params = [wkid]
    return new Promise((resolve, reject) => {
        cassandraClient.client.execute(selectlastheatid, params, { prepare: true })
            .then((rs) => {
                const row = rs.first();
                const heatid = row.get(0);
                return resolve(heatid)
            })
            .catch((reason) => {
                return reject(reason.toString())
            })

    })
};

 function insertNewHeatID(heatdata, newUuid ,lastUuid) {
     console.log('insert')
    return new Promise((resolve, reject) => {
        // const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, 'heatdata.name', heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
        cassandraClient.client.connect()
            .then(() =>
                lanesdata(heatdata.lanes))
            .then((lanes) => {
                console.log('ready ' + JSON.stringify(lanes))
                const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, heatdata.name, heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
                // const params = [newUuid, lastUuid, lanes]
                return params
            })
            .then((params) => {
                console.log('execute with ')
                console.log(params)
                return cassandraClient.client.execute(insertheatquery, params, { prepare: true })
            })
            .then(rs => {
                console.log('insert heat successfull')
                // logger.info(params)
                resolve()
            })
            .catch((reason) => {
                console.log('failed insert heat error ' + reason)
                reject(reason.toString())
            })
    })
};

function lanesdata(lanes) {
    return new Promise((resolve, reject) => {
        // const entries = Object.entries(lanes)
        for (const lane in lanes) {
            if (lane) {
                // correct missing params
                if (lanes[lane].athleteid === undefined) lanes[lane].athleteid = 'NaN'
                if (lanes[lane].birthdate === undefined) lanes[lane].birthdate = '0000-00-00'
                if (lanes[lane].firstname === undefined) lanes[lane].firstname = 'NaN'
                if (lanes[lane].lastname === undefined) lanes[lane].lastname = 'NaN'
                if (lanes[lane].entrytime === undefined) lanes[lane].entrytime = '00:00:00.00'
                if (lanes[lane].name === undefined) lanes[lane].name = 'NaN'
                if (lanes[lane].code === undefined) lanes[lane].code = '0000'
                if (lanes[lane].type === undefined) lanes[lane].type = 'lane'
                if (lanes[lane].event === undefined) lanes[lane].event = '0'
                if (lanes[lane].place === undefined) lanes[lane].place = '0'
                if (lanes[lane].finishtime === undefined) lanes[lane].finishtime = '00:00,00'
                if (lanes[lane].heat === undefined) lanes[lane].heat = '0'
            }
        }
        // logger.log(lanes)
        return resolve(lanes)
    })
};

function clearlanesdata(row) {
    return new Promise((resolve, reject) => {
        // const entries = Object.entries(lanes)
        for (const lane in row.lanes) {
            if (lane) {
                // correct missing params
                if (row.lanes[lane].athleteid === 'NaN') row.lanes[lane].athleteid = ''
                if (row.lanes[lane].birthdate === '0000-00-00') row.lanes[lane].birthdate = ''
                if (row.lanes[lane].firstname === 'NaN') row.lanes[lane].firstname = ''
                if (row.lanes[lane].lastname === 'NaN') row.lanes[lane].lastname = 'keine Belegung'
                if (row.lanes[lane].entrytime === '00:00:00.00') row.lanes[lane].entrytime = 'NT'
                if (row.lanes[lane].name === 'NaN') row.lanes[lane].name = ''
                if (row.lanes[lane].code === '0000') row.lanes[lane].code = ''
                if (row.lanes[lane].finishtime === '00:00,00') row.lanes[lane].finishtime = 'NT'
            }
        }
        // logger.log(lanes)
        return resolve(row)
    })
}

function updateLastHeatID(updateUuid, nextUuid) {
    return new Promise((resolve, reject) => {
        const params = [nextUuid, updateUuid];
        client.connect()
            .then(() =>
                client.execute(updateheatid, params, { prepare: true }))
            .then(() => {
                resolve()
            })
            .catch((reason) => {
                reject(reason.toString())
            })

    })
};


module.exports.add = add