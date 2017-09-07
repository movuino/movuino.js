"use strict";

const m = require("..");
const robotjs = require("robotjs"); // eslint-disable-line node/no-unpublished-require

const sensibility = 0.15;
const gravity = 0.06;

m.once("movuino", movuino => {
  movuino.on("button-down", () => {
    console.log("button");
    robotjs.keyTap("space");
  });

  function test([x, , z]) {
    if (x > sensibility) {
      console.log("left");
      robotjs.keyTap("left");
      unlisten();
      setTimeout(listen, 500);
    } else if (x < -sensibility) {
      console.log("right");
      robotjs.keyTap("right");
      unlisten();
      setTimeout(listen, 500);
    } else if (z > sensibility - gravity) {
      console.log("down");
      robotjs.keyTap("space");
      unlisten();
      setTimeout(listen, 500);
    } else if (z < -sensibility + -gravity) {
      console.log("up");
      robotjs.keyTap("up");
      unlisten();
      setTimeout(listen, 500);
    }
  }

  function listen() {
    movuino.on("data", test);
  }

  function unlisten() {
    movuino.removeListener("data", test);
  }

  listen();
});
