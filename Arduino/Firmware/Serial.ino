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
      messageIN.dispatch("/set/name", setName);
      messageIN.dispatch("/get/name", getName);
    }
  }
}

//void getSerialMsg() {
//  // CHECK SERIAL AND UPDATE msgAdr & msgMsg
//  //----------------------------------------
//
//  //First thing is to check if some messages have been sent
//  if (Serial.available() > 0) {
//    float timBuf0 = millis(); // chipset is designed to reset after 1 second of loop to avoid missing wifi packet
//    delay(10);
//    msgAdr = (char)Serial.read(); // The first incoming byte correspond to the address message, it's supposed to be a char
//
//    bufIndex = 0;
//    do
//    {
//      buff[bufIndex] = Serial.read();// get a byte from the serial port
//      if (buff[bufIndex] != -1) {
//        bufIndex++; // -1 if no byte is present
//      }
//    } while (buff[bufIndex - 1] != 95 && millis()-timBuf0 < 500); //keep collecting bytes until an underscore is received or loop < 1 second
//
//    msgVal = buff[0];
//    for(int i=1; i<bufIndex-1;i++){
//      msgVal += buff[i];
//    }
//    //msgVal = atoi(buff);       // interpret buff char as an integer and get the value corresponding to the address
//
//    delay(10);
//    updateValues(); // this function is placed here for the example but it's up to you
//  }
//}
//
//void updateValues() {
//  // COMMENT SERIAL PRINTS WHILE COMMUNICATING WITH MAX MSP
//  Serial.print("Message address: ");
//  Serial.print(msgAdr);
//  Serial.println("");
//  Serial.print("Message value: ");
//  Serial.print(msgVal);
//  Serial.println("");
//
//  delay(5);
//  switch (msgAdr) {
//      case 's':
//        ssid = (char*) malloc(msgVal.length() + 2); // Initialize with same memory space as needed for the ssid
//        msgVal.toCharArray(ssid, msgVal.length() + 2);
//        break;
//      case 'p':
//        pass = (char*) malloc(msgVal.length() + 2); // Initialize with same memory space as needed for the pass
//        msgVal.toCharArray(pass, msgVal.length() + 2);
//        break;
//      case 'i':
//        hostIP = (char*) malloc(msgVal.length() + 2); // Initialize with same memory space as needed for the ip
//        msgVal.toCharArray(hostIP, msgVal.length() + 2);
//        break;
//      default:
//        Serial.println("No matching address");
//        break;
//  }
//}

//String parseString(String data, char separator, int index){
//  int found = 0;
//  int strIndex[] = { 0, -1 };
//  int maxIndex = data.length() - 1;
//
//  for (int i = 0; i <= maxIndex && found <= index; i++) {
//      if (data.charAt(i) == separator || i == maxIndex) {
//          found++;
//          strIndex[0] = strIndex[1] + 1;
//          strIndex[1] = (i == maxIndex) ? i+1 : i;
//      }
//  }
//  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
//}
