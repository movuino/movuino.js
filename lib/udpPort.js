"use strict";

const osc = require("osc");

const PORT = 7400;

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: PORT
});

udpPort.open();

module.exports = udpPort;
