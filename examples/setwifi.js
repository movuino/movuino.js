/*
In this example, we tell the usb connected movuino what are the informations he needs to connect to a particular wifi network.
The wifi informations are automatically found on the computer and sent to the movuino.
*/

"use strict";

const movuinojs = require("..");
const wifiPassword = require("wifi-password");

async function getConfig() {
  const wifi = await movuinojs.detectWifi();
  wifi.password = await wifiPassword(wifi.ssid);
  return wifi;
}

movuinojs.listen();
movuinojs.on("movuino", movuino => {
  movuino.once("plugged", async () => {
    await movuino.attachSerial();
    const wifi = await getConfig();
    await movuino.setWifi(wifi);
    await movuino.detachSerial();
    movuinojs.unlisten();
  });
});

movuinojs.on("error", err => {
  console.error(err);
});
