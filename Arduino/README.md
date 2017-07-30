* Download and install the Arduino software: https://www.arduino.cc/en/Main/Software
* Download and install the CP2014 driver: http://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx
  * **NOTE**
    * On most of Windows computer, the driver is installed automatically by the system by pluging the Movuino on the USB port;
    * If your computer OS version is old (like Lion on Mac) you may need to install the older version of the driver: http://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
* Inside Arduino
  * Install the card ESP8266 following those instructions: https://learn.sparkfun.com/tutorials/esp8266-thing-hookup-guide/installing-the-esp8266-arduino-addon
 * Go to Tools/Board, select "Adafruit HUZZAH ESP8266" with:
      * CPU Frequency: 80 MHz
      * Flash Size: 4M (3M SPIFFS)
      * Upload Speed: 115200
      * Port: the one corresponding to the Movuino
  * Copy the content of the Arduino folder into your own Arduino folder (Macintosh and Windows: Documents/Arduino). It includes the libraries you need.
  * Restart Arduino
  * Upload firmware