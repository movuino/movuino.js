"use strict";

const m = require("..");

m.once("movuino", movuino => {
  movuino.once("plugged", async () => {
    await movuino.setRange({ accel: 3, gyro: 3 });
    const range = await movuino.getRange();
    console.log(range);
  });
});
