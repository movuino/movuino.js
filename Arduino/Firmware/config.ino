/*
Those functions allows the movuino to change its configuration.
The configuration is stored in the file system (SPIFFS).
*/

// Store the wifi configuration in the file system
void writeWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "w+"); // Let's open or write the file
  if (file) {                 // if the file is there
    file.println(ssid);       // write the SSID in the file
    file.println(pass);       // write the pass
    file.println(hostIP);     // write the hostIP

    file.close();             // close the file
  }
}

// Read the wifi configuration from the file system
void getWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "r");
  if (file) {
    String _ssid = file.readStringUntil('\n');
    String _pass = file.readStringUntil('\n');
    String _hostIP = file.readStringUntil('\n');

    _ssid.toCharArray(ssid, _ssid.length());
    _pass.toCharArray(pass, _pass.length());
    _hostIP.toCharArray(hostIP, _hostIP.length());

    file.close();
  }
}

// Store the sensors ranges in the file system
void writeRange() {
  File file = SPIFFS.open("/range.txt", "w+");
  if (file) {
    file.println(accelRange);
    file.println(gyroRange);

    file.close();
  }
}

// Read and set the sensors ranges from the file system
void configRange() {
  File file = SPIFFS.open("/range.txt", "r");
  if (file) {
    accelRange = file.readStringUntil('\n').toInt();
    gyroRange = file.readStringUntil('\n').toInt();

    file.close();
  }

  accelgyro.setFullScaleAccelRange(accelRange);
  accelgyro.setFullScaleGyroRange(gyroRange);
}
