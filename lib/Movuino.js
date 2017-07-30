"use strict";

const EventEmitter = require("events");
const osc = require("osc");

class Movuino extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.comName = null;
    this.OSCSerialPort = null;
    this.lastUdpMessage = null;
    this.button = false;
  }

  attachSerial() {
    return new Promise((resolve, reject) => {
      const port = new osc.SerialPort({
        devicePath: this.comName,
        bitrate: 115200
      });
      port.once("ready", resolve);
      port.once("error", reject);
      port.open();
      this.OSCSerialPort = port;
    });
  }

  _rpc(addr, args) {
    return new Promise((resolve, reject) => {
      const messageListener = message => {
        if (message.address !== addr) {
          return;
        }
        resolve(message.args);
        this.OSCSerialPort.removeListener("message", messageListener);
        this.OSCSerialPort.removeListener("error", reject);
      };

      this.OSCSerialPort.once("error", reject);

      this.OSCSerialPort.on("message", messageListener);

      this.OSCSerialPort.send({
        address: addr,
        args
      });
    });
  }

  setWifi(config) {
    return this._rpc("/set/wifi", [
      {type: "s", value: config.ssid},
      {type: "s", value: config.password},
      {type: "s", value: config.host}
    ]);
  }

  getWifi() {
    return this._rpc("/get/wifi").then(([ssid, password, host]) => {
      return {ssid, password, host};
    });
  }

  setRange(range) {
    return this._rpc("/set/range", [
      {type: "i", value: range.accel},
      {type: "i", value: range.gyro}
    ]);
  }

  getRange() {
    return this._rpc("/get/range").then(([accel, gyro]) => {
      return {accel, gyro};
    });
  }

  getId() {
    return this._rpc("/get/id").then(([id]) => id);
  }
}

module.exports = Movuino;
