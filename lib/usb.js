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

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function getMovuinoId(comName) {
  try {
    const OSCSerialPort = await serial.attach(comName);
    const id = await serial.getId(OSCSerialPort);
    await serial.detach(OSCSerialPort);
    return id;
  } catch (err) {
    const error = new Error(`Cannot get movuino id for ${comName}`);
    error.reason = err;
    throw err;
  }
}

async function USBAttachListener(device) {
  if (!isUSBMovuino(device)) {
    return;
  }

  await delay(1000);

  const devices = await serial.listMovuinos();
  devices.forEach(async ({ comName }) => {
    // ignore already attached devices
    if (movuinos.movuinos.find(m => m.comName === comName)) {
      return;
    }

    let id;
    try {
      id = await getMovuinoId(comName);
    } catch (err) {
      movuinos.emit("error", err);
      return;
    }

    let movuino = movuinos.movuinos.find(m => m.id === id);
    if (!movuino) {
      movuino = new Movuino(id);
      movuinos.movuinos.push(movuino);
      movuinos.emit("movuino", movuino);
    }
    movuino.plugged = true;
    movuino.comName = comName;
    movuino.emit("plugged");
  });
}

async function USBDetachListener(device) {
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

    movuino.plugged = false;
    movuino.comName = null;
    movuino.emit("unplugged");
  });
}

module.exports.listen = async function() {
  usb.on("attach", USBAttachListener);
  usb.on("detach", USBDetachListener);

  const devices = await serial.listMovuinos();
  for (const { comName } of devices) {
    let id;
    try {
      id = await getMovuinoId(comName); // eslint-disable no-await-in-loop
    } catch (err) {
      movuinos.emit("error", err);
      return;
    }

    let movuino = movuinos.movuinos.find(m => m.id === id);
    if (!movuino) {
      movuino = new Movuino(id);
      movuinos.movuinos.push(movuino);
      movuinos.emit("movuino", movuino);
    }
    movuino.plugged = true;
    movuino.comName = comName;
    movuino.emit("plugged");
  }
};

module.exports.unlisten = async function() {
  usb.removeListener("attach", USBAttachListener);
  usb.removeListener("detach", USBDetachListener);
};
