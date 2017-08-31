void receiveWifiOSC() {
  OSCMessage message;
  int size = Udp.parsePacket();

  if (size > 0) {
    while (size--) {
      message.fill(Udp.read());
    }
    if (!message.hasError()) {
      message.dispatch("/vibroPulse", callbackVibroPulse);
      message.dispatch("/vibroNow", callbackVibroNow);
    } else {
      error = message.getError();
      Serial.print("error: ");
      Serial.println(error);
    }
  }
}

//-----------------------------------------------
//---------------- START WIFI -------------------
//-----------------------------------------------

void startWifi(){
  WiFi.hostname(hostname);
  WiFi.begin(ssid, pass);

//  Serial.println();
//  Serial.println();
//  Serial.print("Wait for WiFi... ");

  // wait while connecting to wifi ...
  long timWifi0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - timWifi0 < 20000) {
//    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    // Movuino is now connected to Wifi
//    Serial.println("");
//    Serial.println("WiFi connected");
//    Serial.println("IP address: ");
//    Serial.println(WiFi.localIP());

    // Start client port (to send message)
//    Serial.println("Starting client port");
    Udp.begin(portOut);
    delay(50);
    IPAddress myIp = WiFi.localIP();

    // Start server port (to receive message)
//    Serial.println("Starting server port");
    Udp.begin(portIn);
//    Serial.print("Server port: ");
//    Serial.println(Udp.localPort());
  }
  else {
    DEBUG(String("Unable to connect to " + String(ssid) + " network."));
    // Serial.print("Unable to connect on ");
    // Serial.print(ssid);
    // Serial.println(" network.");
  }
}


//-----------------------------------------------
//---------------- STOP WIFI --------------------
//-----------------------------------------------

void shutDownWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFi.mode(WIFI_OFF);
    WiFi.forceSleepBegin();
    delay(1); // needed
    digitalWrite(pinLedWifi, HIGH); // turn OFF wifi led
    digitalWrite(pinLedBat, HIGH);  // turn OFF battery led
  }
}


//-----------------------------------------------
//---------------- AWAKE WIFI -------------------
//-----------------------------------------------

void awakeWifi() {
  if(!(WiFi.status() == WL_CONNECTED)){
    // Awake wifi and re-connect Movuino
    WiFi.forceSleepWake();
    WiFi.mode(WIFI_STA);
    WiFi.hostname(hostname);
    WiFi.begin(ssid, pass);
    digitalWrite(pinLedBat, LOW); // turn ON battery led

    //Blink wifi led while wifi is connecting
    long timWifi0 = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - timWifi0 < 20000) {
    //while (WiFiMulti.run() != WL_CONNECTED && millis() - timWifi0 < 10000) {
//      Serial.print(":");
      digitalWrite(pinLedWifi, LOW);
      delay(200);
      digitalWrite(pinLedWifi, HIGH);
      delay(200);
    }
    digitalWrite(pinLedWifi, LOW); // turn ON wifi led


    if (WiFi.status() == WL_CONNECTED) {
      // Movuino is now connected to Wifi
//      Serial.println("");
//      Serial.println("WiFi connected");
//      Serial.println("IP address: ");
//      Serial.println(WiFi.localIP());

      // Start client port (to send message)
//      Serial.println("Starting client port");
      Udp.begin(portOut);
      delay(50);
      IPAddress myIp = WiFi.localIP();

      // Start server port (to receive message)
//      Serial.println("Starting server port");
      Udp.begin(portIn);
//      Serial.print("Server port: ");
//      Serial.println(Udp.localPort());
    }
    else{
      String msg = String("Unable to connect to " + String(ssid) + " network.");
      DEBUG(msg);
      // Serial.print("Unable to connect on ");
      // Serial.print(ssid);
      // Serial.println(" network.");
    }
  }
}
