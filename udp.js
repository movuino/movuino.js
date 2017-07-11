'use strict'

const osc = require('osc')
const PORT = 7400

console.log(process.argv)

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: PORT
});

udpPort.on("ready", function () {
  console.log('UDP ready listenong on port', PORT)
});

udpPort.on("message", function (oscMessage, timeTag, info) {
  console.log('UDP message', oscMessage, timeTag, info)
});

udpPort.on("error", function (err) {
  console.error(err);
});

udpPort.open();
