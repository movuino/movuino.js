movuino.js
==========

Firmware and JavaScript library for the Movuino.

Tested with electron and Node.js, should work with NW.js as well.

On Linux you'll need permission to access the serial device. Add yourself to the right group then relog.

### Arch

`$ gpasswd -a $USER uucp`

### Ubuntu

`$ usermod -a -G dialout $USER`