/*
OMG so simple ! We print all the sensor datas we get in the console.
*/

"use strict";

const movuinojs = require("..");

movuinojs.once("movuino", movuino => { // When a movuino is detected
  movuino.on("data", data => {         // and we receive its datas
    console.log(data);                 // print this shit in the console
  });
});
