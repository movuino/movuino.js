void getId(OSCMessage &msgIn) {
  OSCMessage msg("/get/id");
  msg.add(CID);

  //start a new SLIP Packet
  SLIPSerial.beginPacket();
  //send the data
  msg.send(SLIPSerial);
  //end the packet
  SLIPSerial.endPacket();
  // free space occupied by message
  msg.empty();
}

void setWifi(OSCMessage &msgIn) {
  msgIn.getString(0, ssid, 40);
  msgIn.getString(1, pass, 40);
  msgIn.getString(2, hostIP, 15);

  writeWifiConfig();

  shutDownWifi();
  awakeWifi();
}

void getWifi(OSCMessage &msgIn) {
  OSCMessage msg("/get/wifi");
  msg.add(ssid);
  msg.add(pass);
  msg.add(hostIP);

  //start a new SLIP Packet
  SLIPSerial.beginPacket();
  //send the data
  msg.send(SLIPSerial);
  //end the packet
  SLIPSerial.endPacket();
  // free space occupied by message
  msg.empty();
}


void getName(OSCMessage &msgIn) {
  File file = SPIFFS.open("/name.txt", "r");
  if (file) {
    OSCMessage msg("/get/name");
    char * name = (char*) malloc(40);
    String _name = file.readStringUntil('\n');
    _name.toCharArray(name, _name.length());
    msg.add(name);

    //start a new SLIP Packet
    SLIPSerial.beginPacket();
    //send the data
    msg.send(SLIPSerial);
    //end the packet
    SLIPSerial.endPacket();
    // free space occupied by message
    msg.empty();

    file.close();
  }
}

void setName(OSCMessage &msgIn) {
  File file = SPIFFS.open("/name.txt", "w+");
  if (file) {
    char * name = (char*) malloc(40);
    msgIn.getString(0, name, 40);
    file.println(name);
    file.close();

    OSCMessage msg("/set/name");
    //start a new SLIP Packet
    SLIPSerial.beginPacket();
    //send the data
    msg.send(SLIPSerial);
    //end the packet
    SLIPSerial.endPacket();
    // free space occupied by message
    msg.empty();
  }
}

