movuino.js
==========

Firmware and JavaScript library for the Movuino.

Tested with electron and Node.js, should work with NW.js as well.

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
