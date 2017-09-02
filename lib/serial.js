"use strict";

const promisify = require("util.promisify");

const osc = require("osc");
const serialport = require("serialport");
const listSerial = promisify(serialport.list);

const MOVUINO_VENDOR_ID = "10c4";
// const MOVUINO_PRODUCT_ID = "0xea60";

function isMovuino(device) {
  return device.vendorId === MOVUINO_VENDOR_ID 
  // && device.productId === MOVUINO_PRODUCT_ID;
}

module.exports.listMovuinos = async function () {
  const devices = await listSerial();
  return devices
    .filter(device => isMovuino(device));
};

module.exports.attach = function (comName) {
  return new Promise((resolve, reject) => {
    const port = new osc.SerialPort({
      devicePath: comName,
      bitrate: 115200
    });
    port.once("ready", () => {
      resolve(port);
    });
    port.once("error", reject);
    port.open();
  });
};

module.exports.detach = function (OSCSerialPort) {
  return new Promise(resolve => {
    OSCSerialPort.once("close", resolve);
    OSCSerialPort.close();
  });
};

function rpc(OSCSerialPort, address, args) {
  return new Promise((resolve, reject) => {
    const messageListener = message => {
      if (message.address !== address) {
        return;
      }
      resolve(message.args);
      OSCSerialPort.removeListener("message", messageListener);
      OSCSerialPort.removeListener("error", reject);
    };

    OSCSerialPort.once("error", reject);

    OSCSerialPort.on("message", messageListener);

    OSCSerialPort.send({
      address,
      args
    });
  });
}
module.exports.rpc = rpc;

module.exports.getId = function (OSCSerialPort) {
  return rpc(OSCSerialPort, "/get/id").then(([id]) => id);
};
