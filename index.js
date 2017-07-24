"use strict";

const wifi = require("node-wifi");
const os = require("os");

const movuino = require("./lib/movuinos");
require("./lib/usb");
require("./lib/wifi");

function getInterfaceAddress(int) {
  const interfaces = os.networkInterfaces();
  return interfaces[int][0].address;
}

module.exports = movuino;
module.exports.detectWifi = () => {
  return new Promise((resolve, reject) => {
    wifi.init();
    wifi.getCurrentConnections((err, conns) => {
      if (err) {
        return reject(err);
      }
      const {iface, ssid} = conns[0];
      const host = getInterfaceAddress(iface);
      resolve({ssid, host});
    });
  });
};
