/*
 Actions are things the movuino has to do when asked over Serial.
 Communication is based on SLIP encoded OSC messages.
 This API is used by movuino.js
*/

// asking for the Movuino ID
void getId(OSCMessage &msgIn) {
  // Let's create and send an OSC message containing the movuino ID
  OSCMessage msg("/get/id");
  msg.add(CID);
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();
}

// receiving a new wifi configuration for the movuino
void setWifi(OSCMessage &msgIn) {
  // Read the new configuration
  msgIn.getString(0, ssid, 40);
  msgIn.getString(1, pass, 40);
  msgIn.getString(2, hostIP, 15);

  writeWifiConfig(); // Write the new configuration in the file system

  // Send an empty message to confirm
  OSCMessage msg("/set/wifi");
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();

  // Reboot the wifi with new configuration
  shutDownWifi();
  awakeWifi();
}

// asking for the current wifi configuration
void getWifi(OSCMessage &msgIn) {
  // Create and send an OSC message containing the current wifi configuration
  OSCMessage msg("/get/wifi");
  msg.add(ssid);
  msg.add(pass);
  msg.add(hostIP);
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();
}

// asking for the sensors ranges
void getRange(OSCMessage &msgIn) {
  // Getting the ranges
  int _accelRange = accelgyro.getFullScaleAccelRange();
  int _gyroRange = accelgyro.getFullScaleGyroRange();

  // Create and send an OSC message containing the current sensor ranges
  OSCMessage msg("/get/range");
  msg.add(_accelRange);
  msg.add(_gyroRange);
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();
}

// receiving new sensor ranges
void setRange(OSCMessage &msgIn) {
  // read the new ranges
  accelRange = msgIn.getInt(0);
  gyroRange = msgIn.getInt(1);

  writeRange(); // write the new ranges in a file
  configRange(); // change the sensors ranges with new ranges

  // send an empty message to confirm
  OSCMessage msg("/set/range");
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();
}
