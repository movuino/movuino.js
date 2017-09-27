"use strict";

const Movuino = require("./Movuino");
const movuinos = require("./movuinos");
const osc = require("osc");

const PORT = 7400;
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: PORT
});
let interval;

function WifiMessageListener({ address, args }, timeTag, info) {
  if (address !== "/movuino") {
    return;
  }

  const [id, isBtn, isVibro, accel, gyro, ...motions] = args;
  let movuino = movuinos.movuinos.find(m => m.id === id);
  if (!movuino) {
    movuino = new Movuino(id);
    movuinos.movuinos.push(movuino);
    movuinos.emit("movuino", movuino);
  }

  const button = Boolean(isBtn);
  if (movuino.button === false && button === true) {
    movuino.emit("button-down");
  } else if (movuino.button === true && button === false) {
    movuino.emit("button-up");
  }
  movuino.button = button;

  const vibrator = Boolean(isVibro);
  if (movuino.vibrator === false && vibrator === true) {
    movuino.emit("vibrator-on");
  } else if (movuino.vibrator === true && vibrator === false) {
    movuino.emit("vibrator-off");
  }
  movuino.vibrator = vibrator;

  if (motions.length > 0) {
    movuino.emit("data", motions);
  }

  movuino.accel = accel;
  movuino.gyro = gyro;

  if (!movuino.lastUdpMessage) {
    movuino.address = info.address;
    movuino.port = info.port;
    movuino.emit("online", info);
    movuino.attachUdpPort(udpPort);
  }
  movuino.lastUdpMessage = Date.now();
}

module.exports.interval = null;

module.exports.udpPort = udpPort;

module.exports.listen = function() {
  udpPort.open();
  interval = setInterval(() => {
    const now = Date.now();
    movuinos.movuinos.forEach(movuino => {
      if (!movuino.lastUdpMessage) {
        return;
      }
      const delta = now - movuino.lastUdpMessage;
      if (delta < 500) {
        return;
      }
      movuino.emit("offline");
      movuino.lastUdpMessage = null;
    });
  }, 0);
  udpPort.on("message", WifiMessageListener);
};

module.exports.unlisten = function() {
  udpPort.close();
  clearInterval(interval);
  udpPort.removeListener("message", WifiMessageListener);
};
