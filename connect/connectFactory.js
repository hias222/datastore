const MQTT = require('mqtt');
const AWS = require('aws-iot-device-sdk/device')
const SQS = require('./sqsConnect')

var debug = process.env.MQTT_DEBUG === 'true' ? true : false;
var dstMqttMode = process.env.SRC_MQTT_MODE || "MQTT"

const connect = { MQTT, AWS, SQS };

module.exports = {
    createConnect(type, mqttdestination, settings) {
        const ConnectType = connect[type];
        //Mqtt.connect(attributes)
        if (debug) console.log('<receiver> connectFactory')
        if (debug) console.log(mqttdestination)
        if (debug) console.log(settings)
        if (type === 'AWS') {
            const AWSDevice = ConnectType({
                host: 'a101aihtfyydn6-ats.iot.eu-central-1.amazonaws.com',
                keyPath: 'aws/colorado.private.key',
                certPath: 'aws/colorado.cert.pem',
                caPath: 'aws/root-CA.crt',
                clientId: 'sdk-nodejs-d9122ba1-c0df-4470-a82f-6cd8b7c04e21'
                /*
                keyPath: args.privateKey,
                certPath: args.clientCert,
                caPath: args.caCert,
                clientId: args.clientId,
                region: args.region,
                baseReconnectTimeMs: args.baseReconnectTimeMs,
                keepalive: args.keepAlive,
                protocol: args.Protocol,
                port: args.Port,
                host: args.Host,
                debug: args.Debug
                */
            });
            return AWSDevice
        } else {
            return ConnectType.connect(mqttdestination, settings)
        }

    }
};

module.exports.deleteMessage = (params) => {
    return new Promise((resolve, reject) => {
        if (dstMqttMode === 'SQS') {
            SQS.deleteMe(params)
                .then((data) => {
                    console.log('<connectFactory> delete ' + data)
                    resolve('success')
                })
                .catch((err) => {
                    reject(err)
                })

        } else {
            console.log('not AWS')
            resolve('nothing to do')
        }
    })
    /*
    return new Promise((resolve, reject) => {
        if (dstMqttMode === 'AWS') {
            SQS.deleteMsg(params)
        }
        console.log('delete')
        resolve('success')
    })
    */
};
