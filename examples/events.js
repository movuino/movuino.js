/*
In this simple example, every event is printed in the console.
*/

"use strict";

const movuinojs = require("..");
movuinojs.listen();

// error handling
movuinojs.on("error", error => {
  console.error(error);
});

// When movuino.js detects a movuino
movuinojs.on("movuino", movuino => {
  console.log(movuino.id, "movuino");

  movuino.on("error", error => {
    // Event
    console.error(movuino.id, "error", error); // Log
  });

  movuino.on("plugged", () => {
    //Event
    console.log(movuino.id, "plugged"); // log etc...
  });

  movuino.on("unplugged", () => {
    console.log(movuino.id, "unplugged");
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
