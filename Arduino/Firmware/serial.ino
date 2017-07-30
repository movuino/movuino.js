void DEBUG(String message) {
  const char * _message = message.c_str();
  OSCMessage msg("/movuino/message");
  msg.add(_message);

  //start a new SLIP Packet
  SLIPSerial.beginPacket();
  //send the data
  msg.send(SLIPSerial);
  //end the packet
  SLIPSerial.endPacket();
  // free space occupied by message
  msg.empty();
}

void receiveSerialOSC() {
  OSCMessage messageIN;
  int size;
  //receive a bundle
  if (SLIPSerial.available()) {
    while (!SLIPSerial.endofPacket())
      if ( (size = SLIPSerial.available()) > 0)
      {
        while (size--)
          messageIN.fill(SLIPSerial.read());
      }
    if (!messageIN.hasError())
    {
      messageIN.dispatch("/get/id", getId);
      messageIN.dispatch("/set/wifi", setWifi);
      messageIN.dispatch("/get/wifi", getWifi);
      messageIN.dispatch("/set/range", setRange);
      messageIN.dispatch("/get/range", getRange);
    }
  }
}
