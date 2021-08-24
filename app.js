const express = require("express");
var cors = require('cors');
const http = require("http");

require('dotenv').config();

const mqttConfig = require("./connect/mqttSettings");
const connectFactory = require("./connect/connectFactory");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const sourceMqttMode = process.env.SRC_MQTT_MODE || 'MQTT'
const topic_name = process.env.SRC_CHANNEL_NAME || 'storechannel'
const debug = process.env.MQTT_DEBUG === 'true' ? true : false;

var client = connectFactory.createConnect(sourceMqttMode, mqttConfig.mqttDestination, mqttConfig.mqttSettings);

const app = express();

app.use(index);
app.use(cors());
app.options('*', cors());

const server = http.createServer(app);

if (debug) console.log('<app> Source ' + sourceMqttMode  + ' Topic:  ' + topic_name)

server.listen(port, () => console.log(`<app>Listening on port ${port}`));

client.on('connect', function () {
  console.log('<app> ' + sourceMqttMode  + '  backend connected');
  client.subscribe(topic_name);
});

client.on('error', function () {
  console.log('<app> ' + sourceMqttMode  + ' backend error');
  client.subscribe(topic_name);
});

function checkMQTT() {
  if (!client.connected) {
    console.log('<app> failure ' + sourceMqttMode )
  }
}

setInterval(checkMQTT, 1000);

client.on('message', function (topic, message) {
  //console.log('websocket backend', topic, message.toString());
  console.log(message)
});

