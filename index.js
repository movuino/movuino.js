"use strict";

const nodewifi = require("node-wifi");
const os = require("os");

const movuino = require("./lib/movuinos");
const usb = require("./lib/usb");
const wifi = require("./lib/wifi");

function getInterfaceAddress(int) {
  const interfaces = os.networkInterfaces();
  return interfaces[int][0].address;
}

module.exports = movuino;

module.exports.listen = function() {
  usb.listen();
  wifi.listen();
};

module.exports.unlisten = function() {
  usb.unlisten();
  wifi.unlisten();
};

module.exports.detectWifi = () => {
  return new Promise((resolve, reject) => {
    nodewifi.init();
    nodewifi.getCurrentConnections((err, conns) => {
      if (err) {
        return reject(err);
      }
      if (!conns[0]) {
        return resolve({});
      }
      const { iface, ssid } = conns[0];
      const host = getInterfaceAddress(iface);
      resolve({ ssid, host });
    });
  });
};
