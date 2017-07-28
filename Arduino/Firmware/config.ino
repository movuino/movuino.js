void writeWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "w+");
  if (file) {
    file.println(ssid);
    file.println(pass);
    file.println(hostIP);

    file.close();
  }
}

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

void writeRange() {
  File file = SPIFFS.open("/range.txt", "w+");
  if (file) {
    file.println(accelRange);
    file.println(gyroRange);

    file.close();
  }
}

void getRange() {
  File file = SPIFFS.open("/range.txt", "r");
  if (file) {
    String _accelRange = file.readStringUntil('\n');
    String _gyroRange = file.readStringUntil('\n');

    _accelRange.toCharArray(accelRange, _accelRange.length());
    _gyroRange.toCharArray(gyroRange, _gyroRange.length());

    accelgyro.setFullScaleGyroRange(_accelRange.toInt());
    accelgyro.setFullScaleAccelRange(_gyroRange.toInt());

    file.close();
  }
}
