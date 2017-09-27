"use strict";

const EventEmitter = require("events");
const serial = require("./serial");

class Movuino extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.comName = null;
    this.OSCSerialPort = null;
    this.lastUdpMessage = null;
    this.button = false;
    this.vibrator = false;
    this.port = 0;
    this.address = "";
    this.udpPort = null;
  }

  attachUdpPort(udpPort) {
    this.udpPort = udpPort;
  }

  detachUdpPort() {
    this.udpPort = null;
  }

  attachSerial() {
    return serial.attach(this.comName).then(OSCSerialPort => {
      this.OSCSerialPort = OSCSerialPort;
      return OSCSerialPort;
    });
  }

  detachSerial() {
    return serial.detach(this.OSCSerialPort);
  }

  _rpc(address, args) {
    return serial.rpc(this.OSCSerialPort, address, args);
  }

  setWifi(config) {
    return this._rpc("/set/wifi", [
      { type: "s", value: config.ssid },
      { type: "s", value: config.password },
      { type: "s", value: config.host }
    ]);
  }

  getWifi() {
    return this._rpc("/get/wifi").then(([ssid, password, host]) => {
      return { ssid, password, host };
    });
  }

  setRange(range) {
    return this._rpc("/set/range", [
      { type: "i", value: range.accel },
      { type: "i", value: range.gyro }
    ]);
  }

  getRange() {
    return this._rpc("/get/range").then(([accel, gyro]) => {
      return { accel, gyro };
    });
  }

  getId() {
    return this._rpc("/get/id").then(([id]) => id);
  }

  startVibro() {
    return new Promise(resolve => {
      this.udpPort.send(
        {
          address: "/vibroNow",
          args: [{ type: "i", value: 1 }]
        },
        this.address,
        this.port
      );
      resolve();
    });
  }

  stopVibro() {
    return new Promise(resolve => {
      this.udpPort.send(
        {
          address: "/vibroNow",
          args: [{ type: "i", value: 0 }]
        },
        this.address,
        this.port
      );
      resolve();
    });
  }
}

module.exports = Movuino;
