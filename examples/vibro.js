"use strict";

const m = require("..");

m.on("error", error => {
  console.error(error);
});

m.on("movuino", movuino => {
  console.log(movuino.id, "movuino");

  movuino.on("error", error => {
    console.error(movuino.id, "error", error);
  });

  movuino.on("online", () => {
    console.log(movuino.id, "online");
    movuino.startVibro();
    setTimeout(() => {
      movuino.stopVibro();
    }, 1000);
  });

 
  movuino.on("vibrator-on", () => {
    console.log(movuino.id, "vibrator on");
  });

  movuino.on("vibrator-off", () => {
    console.log(movuino.id, "vibrator off");
  });
});
