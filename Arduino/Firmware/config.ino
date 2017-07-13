void writeWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "w+");

  file.println(ssid);
  file.println(pass);
  file.println(hostIP);

  file.close();
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

