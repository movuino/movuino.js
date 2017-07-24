"use strict";

const m = require("..");
const wifiPassword = require("wifi-password");

async function getConfig() {
  const wifi = await m.detectWifi();
  wifi.password = await wifiPassword(wifi.ssid);
  return wifi;
}

m.on("movuino", movuino => {
  movuino.once("plugged", async () => {
    try {
      await movuino.attachSerial();
      const wifi = await getConfig();
      await movuino.setWifi(wifi);
    } catch (err) {
      console.error(err);
    }
  });
});
