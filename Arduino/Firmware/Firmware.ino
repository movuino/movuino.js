#include <SLIPEncodedSerial.h>
#include <SLIPEncodedUSBSerial.h>
#include <OSCTiming.h>
#include <OSCBoards.h>
#include <OSCBundle.h>
#include <OSCMatch.h>
#include <OSCData.h>
#include <OSCMessage.h>
#include <OSCBoards copy.h>

SLIPEncodedSerial SLIPSerial(Serial);

/*
    This sketch is a Movuino firmware.
    It allows the Movuino to send data on a specific Wifi through an OSC protocol. (Open Sound Control)
*/

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include <FS.h>

const int CID = ESP.getChipId();
const String hostname = String("movuino-") + CID;

// Set your wifi network configuration here
char *ssid = (char *)malloc(40);   // your network SSID (name of the wifi network)
char *pass = (char *)malloc(40);   // your network password
char *hostIP = (char *)malloc(40); // IP address of the host computer
const unsigned int portOut = 7400; // port on which data are sent (send OSC message)
const unsigned int portIn = 7401;  // local port to listen for UDP packets (receive OSC message)
char movuinoIP[4];

MPU6050 accelgyro;
ESP8266WiFiMulti WiFiMulti;
WiFiClient client;
int packetNumber = 0;
int16_t ax, ay, az;                                 // store accelerometre values
int16_t gx, gy, gz;                                 // store gyroscope values
int16_t mx, my, mz;                                 // store magneto values
int magRange[] = {666, -666, 666, -666, 666, -666}; // magneto range values for callibration

// Sensor Ranges
int accelRange = 3;
int gyroRange = 3;

// Button variables
const int pinBtn = 13;  // the number of the pushbutton pin
boolean isBtn = 0;      // variable for reading the pushbutton status
float pressTime = 5000; // pressure time needed to switch Movuino state
float lastButtonTime;
boolean lockPress = false; // avoid several activation on same button pressure

// LEDs
const int pinLedWifi = 2; // wifi led indicator
const int pinLedBat = 0;  // battery led indicator

// Vibrator
const int pinVibro = 14;           // vibrator pin
boolean isVibro = false;           // true when vibrating
int dVibON = 1000;                 // duration of vibration when vibrator is ON
int dVibOFF = 1000;                // delay between vibrations when vibrator is ON
int dVib = dVibON + dVibOFF;       // time between 2 vibration cycles
float rVib = dVibON / (float)dVib; // ratio of time on which vibrations are ON
long timerVibro = 0;               // time where vibrations start
int nVib = 3;                      // number of vibration (-1 for infinite)

// Serial variables
int inByte = 0;      // incoming serial byte
char buff[40];       // buff to store incoming bytes
int bufIndex = 0;    // current index of the buff
char msgAdr = 'X';   // address of received messages
String msgVal = "X"; // values of received messages

WiFiUDP Udp;
OSCErrorCode error;

void stringCallbackFunction(byte pin, int value)
{
  pinMode(pin, OUTPUT);
  analogWrite(pin, value);
}

void setup()
{
  // pin setup
  pinMode(pinBtn, INPUT_PULLUP); // pin for the button
  pinMode(pinLedWifi, OUTPUT);   // pin for the wifi led
  pinMode(pinLedBat, OUTPUT);    // pin for the battery led
  pinMode(pinVibro, OUTPUT);     // pin for the vibrator

  Wire.begin();
  SLIPSerial.begin(115200);
  delay(10);

  if (!SPIFFS.begin())
  {
    Serial.println("Failed to mount file system");
    return;
  }

  //  SPIFFS.remove("/wifi.txt"); // reset wifi config

  getWifiConfig();

  accelgyro.initialize();

  configRange();

  startWifi();
}

void loop()
{
  // Handle serial OSC data
  receiveSerialOSC();

  // BUTTON CHECK
  checkButton();

  // MOVUINO DATA
  if (WiFi.status() == WL_CONNECTED)
  {
    IPAddress myIp = WiFi.localIP();

    // GET MOVUINO DATA
    accelgyro.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz); // Get all 9 axis data (acc + gyro + magneto)
    //---- OR -----//
    //accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz); // Get only axis from acc & gyr

    //delay(5);
    magnetometerAutoCallibration();

    // SEND MOVUINO DATA
    OSCMessage msg("/movuino"); // create an OSC message on address "/movuinOSC"
    msg.add(CID);
    msg.add(!isBtn);
    msg.add(isVibro);

    // For obvious reasons, let's not send motion values while vibrating
    if (!digitalRead(pinVibro))
    {
      msg.add(splitFloatDecimal(-ax / 32768.0)); // add acceleration X data as message
      msg.add(splitFloatDecimal(-ay / 32768.0)); // add acceleration Y data
      msg.add(splitFloatDecimal(-az / 32768.0)); // add ...
      msg.add(splitFloatDecimal(gx / 32768.0));
      msg.add(splitFloatDecimal(gy / 32768.0));
      msg.add(splitFloatDecimal(gz / 32768.0)); // you can add as many data as you want
      msg.add(splitFloatDecimal(my / 100.0));
      msg.add(splitFloatDecimal(mx / 100.0));
      msg.add(splitFloatDecimal(-mz / 100.0));
    }

    Udp.beginPacket(hostIP, portOut); // send message to computer target with "hostIP" on "port"
    msg.send(Udp);
    Udp.endPacket();
    msg.empty();

    // Handle wifi/UDP OSC data
    receiveWifiOSC();
  }
  else
  {
    delay(50); // wait more if Movuino is sleeping
  }
}

float splitFloatDecimal(float f_)
{
  int i_ = f_ * 1000;
  return i_ / 1000.0f;
}

void magnetometerAutoCallibration()
{
  int magVal[] = {mx, my, mz};
  for (int i = 0; i < 3; i++)
  {
    // Compute magnetometer range
    if (magVal[i] < magRange[2 * i])
    {
      magRange[2 * i] = magVal[i]; // update minimum values on each axis
    }
    if (magVal[i] > magRange[2 * i + 1])
    {
      magRange[2 * i + 1] = magVal[i]; // update maximum values on each axis
    }

    // Scale magnetometer values
    if (magRange[2 * i] != magRange[2 * i + 1])
    {
      magVal[i] = map(magVal[i], magRange[2 * i], magRange[2 * i + 1], -100, 100);
    }
  }

  // Update magnetometer values
  mx = magVal[0];
  my = magVal[1];
  mz = magVal[2];
}
