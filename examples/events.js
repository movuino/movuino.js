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

  movuino.on("unplugged", () => {
    console.log(movuino.id, "unplugged");
  });

  movuino.on("plugged", () => {
    console.log(movuino.id, "plugged");
  });

  movuino.on("online", info => {
    console.log(info);
    console.log(movuino.id, "online");
  });

  movuino.on("offline", () => {
    console.log(movuino.id, "offline");
  });

  movuino.on("button-up", () => {
    console.log(movuino.id, "button up");
  });

  movuino.on("button-down", () => {
    console.log(movuino.id, "button down");
  });

  movuino.on("vibrator-on", () => {
    console.log(movuino.id, "vibrator on");
  });

  movuino.on("vibrator-off", () => {
    console.log(movuino.id, "vibrator off");
  });
});
