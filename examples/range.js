/*
The MPU6050, which is the motion tracking device we use, has 4 levels of sensitivity, or range, for its sensors (0 to 3).

Details from the datasheet :
For precision tracking of both fast and slow motions,  the  parts feature  a  user-programmable
gyroscope full-scale  range of  ±250,  ±500,  ±1000,  and ±2000°/sec (dps) and a user-programmable
accelerometer full-scale range of ±2g, ±4g, ±8g, and ±16g.

0 is the first value, 3 is the fourth. The little it is, the more precise/sensitive.

With this example, you can change the range for the accelerometer and the gyroscope.
*/

"use strict";

const movuinojs = require("..");

movuinojs.once("movuino", movuino => {             // When a movuino is detected
  movuino.once("plugged", async () => {            // and when it's plugged in
    await movuino.setRange({ accel: 3, gyro: 3 }); // Set its range (0 to 3)
    const range = await movuino.getRange();        // get the new range
    console.log(range);                            // print it in the console for confirmation
  });
});
