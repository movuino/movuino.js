void writeWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "w+");
  Serial.println("writing file");
  file.println(ssid);
  file.println(pass);
  file.println(hostIP);
  Serial.println(file.size());
  file.close();
}

void getWifiConfig() {
  File file = SPIFFS.open("/wifi.txt", "r");
  if (file) {
    Serial.println("reading file");

    String _ssid = file.readStringUntil('\n');
    String _pass = file.readStringUntil('\n');
    String _hostIP = file.readStringUntil('\n');

    _ssid.toCharArray(ssid, _ssid.length());
    _pass.toCharArray(pass, _pass.length());
    _hostIP.toCharArray(hostIP, _hostIP.length());

    Serial.println(hostIP);
//    while(file.available()) {
//      Serial.println("available");
      //Lets read line by line from the file
//      String line = file.readStringUntil('\n');
//      Serial.println(line);
//      delay(5);
//    }
//    Serial.println("done");
    
//    file.readStringUntil('\n').toCharArray(ssid, 40);
//    Serial.println(ssid);
//    pass = file.readStringUntil('\n');
//    hostIP = file.readStringUntil('\n');
    file.close();
  }
}

