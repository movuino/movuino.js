/*
 Serial communication protocol.
 It's based on SLIP encoded OSC messages.
*/

void receiveSerialOSC() {
  OSCMessage messageIN;
  int size;
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

void DEBUG(String message) {
  const char * _message = message.c_str();
  OSCMessage msg("/movuino/message");
  msg.add(_message);
  SLIPSerial.beginPacket();
  msg.send(SLIPSerial);
  SLIPSerial.endPacket();
  msg.empty();
}
