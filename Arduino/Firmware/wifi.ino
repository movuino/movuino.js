/*
All WIFI related functions
*/

// Wifi OSC communication protocol
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

void startWifi(){
  WiFi.hostname(hostname);
  WiFi.begin(ssid, pass);

  // wait while connecting to wifi
  long timWifi0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - timWifi0 < 20000) {
    delay(500);
  }

  // when connected
  if (WiFi.status() == WL_CONNECTED) {
    Udp.begin(portOut); // Start server port (to send message)
    delay(50);
    IPAddress myIp = WiFi.localIP();
    Udp.begin(portIn);   // Start server port (to receive message)
  }
  else {
    DEBUG(String("Unable to connect to " + String(ssid) + " network."));
  }
}

void shutDownWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFi.mode(WIFI_OFF);
    WiFi.forceSleepBegin();
    delay(1); // needed
    digitalWrite(pinLedWifi, HIGH); // turn OFF wifi led
    digitalWrite(pinLedBat, HIGH);  // turn OFF battery led
  }
}

// If shutDownWifi() has been used, use awakeWifi() to start the WIFI again, not startWifi()
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
      digitalWrite(pinLedWifi, LOW);
      delay(200);
      digitalWrite(pinLedWifi, HIGH);
      delay(200);
    }

    // when connected
    digitalWrite(pinLedWifi, LOW); // turn ON wifi led

    if (WiFi.status() == WL_CONNECTED) {
      Udp.begin(portOut); // Start server port (to send message)
      delay(50);
      IPAddress myIp = WiFi.localIP();
      Udp.begin(portIn);  // Start server port (to receive message)
    }
    else{
      String msg = String("Unable to connect to " + String(ssid) + " network.");
      DEBUG(msg);
    }
  }
}
