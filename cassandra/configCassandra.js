const cassandra = require('cassandra-driver');
const fs = require('fs');

const CONTACTPOINT = process.env.CONTACTPOINT !== undefined ? process.env.CONTACTPOINT : 'localhost'
const CONTACTPOINT_PORT = process.env.CONTACTPOINT_PORT 
const CONTACTNAME = CONTACTPOINT_PORT !== undefined ? CONTACTPOINT + ":" + CONTACTPOINT_PORT : CONTACTPOINT
const CASSANDRA_USER = process.env.CASSANDRA_USER !== undefined ? process.env.CASSANDRA_USER : 'localhost'
const CASSANDRA_PASSWORD = process.env.CASSANDRA_PASSWORD !== undefined ? process.env.CASSANDRA_PASSWORD : 'localhost'

var debug = process.env.MQTT_DEBUG === 'true' ? true : false;

const useroptions = {
    username: CASSANDRA_USER,
    password: CASSANDRA_PASSWORD
}
const connectoptions = {
    contactPoints: [CONTACTNAME],
    localDataCenter: process.env.LOCALDATACENTER,
    keyspace: process.env.KEYSPACE,
    credentials: useroptions
}

const sslconnect = {
    contactPoints: [CONTACTNAME],
    localDataCenter: process.env.LOCALDATACENTER,
    keyspace: process.env.KEYSPACE,
    credentials: useroptions,
    sslOptions: {
        rejectUnauthorized: false
    }
}

const auth = new cassandra.auth.PlainTextAuthProvider(CASSANDRA_USER, CASSANDRA_PASSWORD);

const sslOptions1 = {
         ca: [
                    fs.readFileSync('ssl/sf-class2-root.crt', 'utf-8')],      
                    host: CONTACTPOINT,
                    rejectUnauthorized: true
        };


const awsconnect = {
                   contactPoints: [CONTACTPOINT],
                   localDataCenter: process.env.LOCALDATACENTER,
                   authProvider: auth,
                   sslOptions: sslOptions1,
                   protocolOptions: { port: CONTACTPOINT_PORT }
};

const conn = process.env.SSLCONNECT === 'true' ? sslconnect : process.env.SSLCONNECT === 'aws' ? awsconnect : connectoptions

if (debug) console.log(JSON.stringify(conn))

const client = new cassandra.Client(conn);

module.exports.client = client
