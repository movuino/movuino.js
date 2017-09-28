"use strict";

const nodewifi = require("node-wifi");
const os = require("os");

const movuinos = require("./lib/movuinos");
const usb = require("./lib/usb");
const wifi = require("./lib/wifi");

function getInterfaceAddress(int) {
  const interfaces = os.networkInterfaces();
  return interfaces[int][0].address;
}

module.exports = movuinos;

module.exports.listen = function() {
  return Promise.all([usb.listen(), wifi.listen()]);
};

module.exports.unlisten = function() {
  return Promise.all([usb.unlisten(), wifi.unlisten()]);
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
