"use strict";

const usb = require("usb");

const Movuino = require("./Movuino");
const serial = require("./serial");

const ID_VENDOR = 4292;
const ID_PRODUCT = 60000;

const movuinos = require("./movuinos");

function isUSBMovuino(device) {
  const desc = device.deviceDescriptor;
  return desc.idVendor === ID_VENDOR && desc.idProduct === ID_PRODUCT;
}

serial.listMovuinos().then(devices => {
  devices.forEach(async device => {
    let OSCSerialPort;
    let id;
    try {
      OSCSerialPort = await serial.attach(device.comName);
      id = await serial.getId(OSCSerialPort);
    } catch (err) {
      const error = new Error(`Cannot get movuino id for ${device.comName}`);
      error.reason = err;
      movuinos.emit("error", error);
      return;
    }
    let movuino = movuinos.movuinos.find(m => m.id === id);
    if (!movuino) {
      movuino = new Movuino(id);
      movuinos.movuinos.push(movuino);
      movuinos.emit("movuino", movuino);
    }

    movuino.comName = device.comName;
    movuino.OSCSerialPort = OSCSerialPort;
    movuino.emit("plugged");
  });
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

usb.on("detach", async device => {
  if (!isUSBMovuino(device)) {
    return;
  }

  await delay(1000);

  const devices = await serial.listMovuinos();
  movuinos.movuinos.forEach(movuino => {
    // ignore unplugged movuinos
    if (movuino.comName === null) {
      return;
    }

    // ignore plugged movuinos
    if (devices.find(d => d.comName === movuino.comName)) {
      return;
    }

    movuino.emit("unplugged");
    movuino.comName = null;
  });
});

usb.on("attach", async device => {
  if (!isUSBMovuino(device)) {
    return;
  }

  await delay(1000);

  const devices = await serial.listMovuinos();
  devices.forEach(async device => {
    // ignore already attached devices
    if (movuinos.movuinos.find(m => m.comName === device.comName)) {
      return;
    }

    const OSCSerialPort = await serial.attach(device.comName);
    const id = await serial.getId(OSCSerialPort);

    let movuino = movuinos.movuinos.find(m => m.id === id);
    if (!movuino) {
      movuino = new Movuino(id);
      movuinos.movuinos.push(movuino);
      movuinos.emit("movuino", movuino);
    }
    movuino.comName = device.comName;
    movuino.OSCSerialPort = OSCSerialPort;
    movuino.emit("plugged");
  });
});
