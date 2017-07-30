"use strict";

const m = require("..");

m.once("movuino", movuino => {
  movuino.once("plugged", async () => {
    await movuino.setRange({accel: 2, gyro: 2});
    const range = await movuino.getRange();
    console.log(range);
  });
});
