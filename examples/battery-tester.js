"use strict";

const movuinojs = require("..");

movuinojs.listen();

movuinojs.once("movuino", movuino => {
  console.log("movuino", movuino.id);

  movuino.once("online", () => {
    console.log("movuino online, please disconnect USB cable");

    movuino.once("unplugged", () => {
      console.log(
        "movuino unplugged, time will be displayed once the movuino will disconnect (battery drain)"
      );

      const date = Date.now();

      movuino.once("offline", () => {
        console.log(Date.now() - date, "ms");
      });
    });
  });
});
