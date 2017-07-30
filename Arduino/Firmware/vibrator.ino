//-----------------------------------------------
//--------------- VIBRO PULSE -------------------
//-----------------------------------------------

void callbackVibroPulse(OSCMessage &msg) {
  dVibON = msg.getInt(0);
  dVibOFF = msg.getInt(1);
  nVib = msg.getInt(2);

  setVibroPulse(dVibON, dVibOFF, nVib);
}

void setVibroPulse(int dVibON_, int dVibOFF_, int nVib_){
  dVibON = dVibON_;
  dVibOFF = dVibOFF_;
  nVib = nVib_;

  if (dVibON == 0) {
    isVibro = false; // shut down vibrator if no vibration
    digitalWrite(pinVibro, LOW);
  }
  else {
    dVib = dVibON + dVibOFF;
    rVib = dVibON / (float)dVib;
    timerVibro = millis();
    isVibro = true;
  }
}

void vibroPulse() {
  /*
    ////EXAMPLE to explain what is happening here////

    if you want to vibrate for 1200ms then stop for 500ms: dVibON = 1200  &  dVibOFF = 500
    Total cycle time: dVib = 1200 + 500 = 1700ms

    Now you are at time t = 45200ms and you activate the vibrator at t0 = timerVibro = 36200ms
    Compute (t - t0) / dVib =  45200 / 36200 = 5.29
    this means that you are currently at 29% of the 5th vibration cycle

    To extract the "29%" value: (100*5.29) % 100 = 29
    Now compute the period ratio where you want the vibrator to vibrate: dVibON / dVib = 1200/1700 = 0.71 = 71%

    Here: 29 < 71, this means that at this instant you want the vibrator to vibrate, so: digitalWrite(pinVibro, HIGH)
  */

  int curTimeRatio100 = (int)(100 * (millis() - timerVibro) / (float)dVib) ;

  if (curTimeRatio100 % 100 <  (int)(100 * rVib)) {
    digitalWrite(pinVibro, HIGH);
  }
  else {
    if (dVibOFF != 0) {
      digitalWrite(pinVibro, LOW);
    }
  }

  // Shut down vibrator if number of cycles reach (if nV_ = -1 get infinite cycles)
  if (nVib != -1 && (millis() - timerVibro > nVib * dVib)) {
    digitalWrite(pinVibro, LOW);
    isVibro = false;
  }
}

//-----------------------------------------------
//---------------- VIBRO NOW --------------------
//-----------------------------------------------

void callbackVibroNow(OSCMessage &msg) {
  // Simply turn ON or OFF the vibrator
  // also turn OFF pulsations
  boolean isVibr = msg.getInt(0);
  vibroNow(isVibr);
}

void vibroNow(boolean isVibr_){
  if (isVibr_) {
    isVibro = true;
    digitalWrite(pinVibro, HIGH);
  }
  else {
    isVibro = false; // turn OFF pulsations
    digitalWrite(pinVibro, LOW);
  }
}
