/*
What if everytime the movuino accelerates in one direction, an arrow key is pushed?
In this example, X+ is left key, X- is right key, Z+ (up) is up key and Z- (down) is the spacebar key.
The movuino button is also assigned to the spacebar.
There's a 500 ms delay between each keytap.
*/

"use strict";

const movuinojs = require("..");
const robotjs = require("robotjs"); // eslint-disable-line node/no-unpublished-require

const sensitivity = 0.15; // threshold : you need to accelerate more than that
const gravity = 0.06;

movuinojs.once("movuino", movuino => {

  // The movuino button is assigned to the spacebar key
  movuino.on("button-down", () => {
    console.log("button");
    robotjs.keyTap("space");
  });

  function accelToArrowKeys([x, , z]) {
    if (x > sensitivity) {      // if the X axis sensor data is more than our sensitivity
      console.log("left");      // print "left" in the console
      robotjs.keyTap("left");   // left arrow keytap
      unlisten();               // stop listening to datas
      setTimeout(listen, 500);  // resume listening in 500 ms
    } else if (x < -sensitivity) {
      console.log("right");
      robotjs.keyTap("right");
      unlisten();
      setTimeout(listen, 500);
    } else if (z > sensitivity - gravity) { // On the Z axis we have gravity, so we need to compensate.
      console.log("down");
      robotjs.keyTap("space");
      unlisten();
      setTimeout(listen, 500);
    } else if (z < -sensitivity + -gravity) {
      console.log("up");
      robotjs.keyTap("up");
      unlisten();
      setTimeout(listen, 500);
    }
  }

  function listen() {
    movuino.on("data", accelToArrowKeys);
  }

  function unlisten() {
    movuino.removeListener("data", accelToArrowKeys);
  }

  listen();
});
