/*
In this example, acceleration on a specifi axis will trigger a midi note. Cool !
*/

"use strict";

const movuinojs = require("..");
// https://github.com/justinlatimer/node-midi
const midi = require("midi"); // eslint-disable-line node/no-unpublished-require
// https://github.com/danigb/note-parser
const parseNote = require("note-parser").midi; // eslint-disable-line node/no-unpublished-require

const output = new midi.output(); // eslint-disable-line new-cap
output.openPort(0);

const velocity = 127; // Midi velocity 0 - 127
const accelerometerSensitivity = 0.05; // Motion sensitivity 0 - 1
const gyroscopeSensitivity = 0.1; // Motion sensitivity 0 - 1
const gravity = 0.06; // Gravity effect on sensitivity
const delay = 150; // how much time should we stop listening between each notes

function startNote(note) {
  output.sendMessage([144, parseNote(note), velocity]);
}

function stopNote(note) {
  // Not sure which one is best to use
  // note on
  // output.sendMessage([144, note, 0]);
  // note off
  output.sendMessage([128, parseNote(note), 0]);
}

function playNote(note, ms = 200) {
  startNote(note);
  setTimeout(() => {
    stopNote(note);
  }, ms);
}

movuinojs.listen();
// prettier-ignore
movuinojs.on("movuino", movuino => {        // when a movuino is connected
  function ondata([x, y, z, gx, gy, gz]) {  // and we receive its sensors datas
    // Accelerometer
    if (x > accelerometerSensitivity) {     // if acceleration on X is more than the accelerometer sensitivity
      console.log("x+ (left)");             // print this stuff in the console
      playNote("A2");                       // play a note
      unlisten();                           // stop listening to data
      setTimeout(listen, delay);            // resume listening after X ms (delay)
    } else if (x < -accelerometerSensitivity) {
      console.log("x- (right)");
      playNote("B2");
      unlisten();
      setTimeout(listen, delay);
    } else if (y > accelerometerSensitivity) {
      console.log("y+ (forward)");
      playNote("C2");
      unlisten();
      setTimeout(listen, delay);
    } else if (y < -accelerometerSensitivity) {
      console.log("y- (backward)");
      playNote("D2");
      unlisten();
      setTimeout(listen, delay);
    } else if (z > accelerometerSensitivity - gravity) {
      console.log("z- (down)");
      playNote("E2");
      unlisten();
      setTimeout(listen, delay);
    } else if (z < -accelerometerSensitivity + -gravity) {
      console.log("z+ (up)");
      playNote("F2");
      unlisten();
      setTimeout(listen, delay);
      // Gyroscope
    } else if (gx > gyroscopeSensitivity) {
      console.log("gx+ (pitch bacward)");
      playNote("A4");
      unlisten();
      setTimeout(listen, delay);
    } else if (gx < -gyroscopeSensitivity) {
      console.log("gx- (pitch forward)");
      playNote("B4");
      unlisten();
      setTimeout(listen, delay);
    } else if (gy > gyroscopeSensitivity) {
      console.log("gy+ (roll right)");
      playNote("C4");
      unlisten();
      setTimeout(listen, delay);
    } else if (gy < -gyroscopeSensitivity) {
      console.log("gy- (roll left)");
      playNote("D4");
      unlisten();
      setTimeout(listen, delay);
    } else if (gz > gyroscopeSensitivity - gravity) {
      console.log("gz- (yaw left)");
      playNote("E4");
      unlisten();
      setTimeout(listen, delay);
    } else if (gz < -gyroscopeSensitivity + -gravity) {
      console.log("gz+ (yaw right)");
      playNote("F4");
      unlisten();
      setTimeout(listen, delay);
    }
  }

  function listen() {
    movuino.on("data", ondata);
  }

  function unlisten() {
    movuino.removeListener("data", ondata);
  }

  listen();
});

movuinojs.on("error", err => {
  console.error(err);
});

process.on("SIGINT", () => {
  output.closePort();
  process.exit(); // eslint-disable-line no-process-exit
});
