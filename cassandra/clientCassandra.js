const cassandraClient = require('./configCassandra')
const { types } = require('cassandra-driver');
const sql = require('./sqlQueries')

require('dotenv').config();
var debug = process.env.MQTT_DEBUG === 'true' ? true : false;

const wkid = 1;

function constructor() {
    cassandraClient.client.connect()
        .then(() => logger.info('connected'))
        .catch((data) => logger.error(data));
};


async function add(heatdata) {
    return new Promise((resolve, reject) => {
        const Uuid = types.Uuid.random();
        let lastUuid;
        const logg = '<clientCassandra> Add' +  Uuid + ' e: ' + heatdata.event + ' h: ' + heatdata.heat
        console.log(logg.toString());

        if (debug) console.log(JSON.stringify(heatdata))

        const params2 = [wkid, Uuid]

        cassandraClient.client.connect()
            .then(() =>
                getLastID())
            .then(result => {
                lastUuid = result;
                if (debug) console.log('<clientCassandra> last id ' + result + ' new ' + Uuid);
                return insertNewHeatID(heatdata, Uuid, result)
            })
            .then(() => {
                // update last heat id overall for gui start
                return cassandraClient.client.execute(sql.insertheatid, params2, { prepare: true })
            })
            .then(() => {
                console.log('<clientCassandra> update last heat ' + lastUuid)
                updateLastHeatID(lastUuid, Uuid)
            })
            .then(() => resolve({ 'uuid': Uuid }))
            .catch(reason => {
                console.log('<clientCassandra> failure in add heat')
                if (debug) console.log(reason)
                return reject(reason.info)
            })
    })
};

function getLastID() {
    const params = [wkid]
    return new Promise((resolve, reject) => {
        cassandraClient.client.execute(sql.selectlastheatid, params, { prepare: true })
            .then((rs) => {
                const row = rs.first();
                const heatid = row.get(0);
                return resolve(heatid)
            })
            .catch((reason) => {
                const heatid = '4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a'
                const paramnew = ['0', heatid]
                cassandraClient.client.execute(sql.insertheatid, paramnew, { prepare: true })
                console.log(reason)
                console.log("create new event")
                return resolve(heatid)
                //return reject(reason.toString())
            })

    })
};

function insertNewHeatID(heatdata, newUuid, lastUuid) {
    return new Promise((resolve, reject) => {
        // const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, 'heatdata.name', heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
        cassandraClient.client.connect()
            .then(() =>
                lanesdata(heatdata.lanes))
            .then((lanes) => {
                if (debug) console.log('<clientCassandra> checked lanes data -->  ' + JSON.stringify(lanes))
                const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, heatdata.name, heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
                // const params = [newUuid, lastUuid, lanes]
                return params
            })
            .then((params) => {
                if (debug) console.log('<clientCassandra> insertheatquery with ' + JSON.stringify(params))
                return cassandraClient.client.execute(sql.insertheatquery, params, { prepare: true })
            })
            .then(rs => {
                console.log('<clientCassandra> insert heat successfull ' + heatdata.event + ' - ' + heatdata.heat)
                resolve()
            })
            .catch((reason) => {
                console.log('<clientCassandra> failed insert heat error ' + reason)
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
            lanes[lane] = JSON.stringify(lanes[lane])
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
        cassandraClient.client.connect()
            .then(() =>
                cassandraClient.client.execute(sql.updateheatid, params, { prepare: true }))
            .then(() => {
                resolve()
            })
            .catch((reason) => {
                reject(reason.toString())
            })

    })
};


module.exports.add = add