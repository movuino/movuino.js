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
