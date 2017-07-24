"use strict";

const m = require("..");

m.on("movuino", movuino => {
  console.log("movuino", movuino.id);

  movuino.on("unplugged", () => {
    console.log("unplugged", movuino.id);
  });

  movuino.on("plugged", () => {
    console.log("plugged", movuino.id);
  });

  movuino.on("online", () => {
    console.log("online", movuino.id);
  });

  movuino.on("offline", () => {
    console.log("offline", movuino.id);
  });
});
