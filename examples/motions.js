"use strict";

const m = require("..");

m.once("movuino", movuino => {
  movuino.on("data", data => {
    console.log(data);
  });
});
