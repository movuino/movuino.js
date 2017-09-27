/*
Now we're talking ! This example show you how to play with the vibrator of the movuino over wifi.
*/

"use strict";

const movuinojs = require("..");

movuinojs.listen();

// Error handling
movuinojs.on("error", error => {
  console.error(error);
});

// prettier-ignore
movuinojs.on("movuino", movuino => {            // When we detect a movuino
  console.log(movuino.id, "movuino");           // we print its ID

  movuino.on("error", error => {                // error handling
    console.error(movuino.id, "error", error);
  });

  movuino.on("online", () => {                  // When the movuino is online (connected via WIFI)
    console.log(movuino.id, "online");          // we print the good news in the console
    movuino.startVibro();                       // Let's vibrate baby !
    setTimeout(() => {
      movuino.stopVibro();                      // Stop the vibration
    }, 1000);                                   // after 1 second
  });

  movuino.on("vibrator-on", () => {
    console.log(movuino.id, "vibrator on");
  });

  movuino.on("vibrator-off", () => {
    console.log(movuino.id, "vibrator off");
  });
});
