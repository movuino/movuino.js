void checkButton(){
  isBtn = digitalRead(pinBtn); // check if button is pressed
  if (isBtn) {
    lastButtonTime = millis();
    lockPress = false;
  }
  else {
    digitalWrite(pinVibro, LOW); // turn off vibrator

    if (millis() - lastButtonTime > pressTime && !lockPress) {
      lockPress = true; // avoid several activation with same pressure
      //isWifi = !isWifi; // switch state
      lastButtonTime = millis();

      if (WiFi.status() == WL_CONNECTED) {
        shutDownWifi();
      }
      else {
        awakeWifi();
      }
    }
  }
}
