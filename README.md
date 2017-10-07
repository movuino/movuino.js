movuino.js
==========

Firmware and JavaScript library for the Movuino.

Tested with electron and Node.js, should work with NW.js as well.

# Requirements

## Linux

You'll need permission to access the serial device. Add yourself to the right group then relog.

### Arch

`$ gpasswd -a $USER uucp`

### Ubuntu

`$ usermod -a -G dialout $USER`

## Windows

Install [CP210x USB to UART Bridge VCP Drivers](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers) driver.

## OS X

Install [CP210x USB to UART Bridge VCP Drivers](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers) driver.

# Firmware

1. Install the [ESP8266 board](https://learn.sparkfun.com/tutorials/esp8266-thing-hookup-guide/installing-the-esp8266-arduino-addon)

2. Select the `Adafruit HUZZAH ESP8266` board in Arduino IDE

3. Copy the content of [Arduino/libraries](https://github.com/topela/movuino.js/tree/master/Arduino/libraries) into your Arduino libraries folder. See [Where to Install your Libraries](https://learn.adafruit.com/adafruit-all-about-arduino-libraries-install-use/how-to-install-a-library)

Once you selected the right port, you should be able to compile and upload the firmware.
