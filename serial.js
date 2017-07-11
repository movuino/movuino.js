'use strict'

// const SerialPort = require('serialport');
//
// const port = new SerialPort('/dev/tty-usbserial1', {
//   baudRate: 57600
// });
//
// port.on('data', (data) => {
//   console.log(data)
// })

const osc = require('osc')
const usb = require('usb')
const SerialPort = require('serialport')




//
// port.on('data', data => {
//   console.log(data.toString())
// })

usb.on('attach', (device) => {

  const serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
  })
  serialPort.on('error', err => {
    console.error(err)
  })
  serialPort.on('open', () => {
    console.log('serial port open')

    const OSCSerialPort = new osc.SerialPort({
      serialPort,
    })

    OSCSerialPort.on('ready', () => {
      console.log('ready')
      OSCSerialPort.send({
        address: "/get/CID",
      })
    })

    // Listen for the message event and map the OSC message to the synth.
    OSCSerialPort.on("message", function (oscMsg) {
        console.log("An OSC message was received!", oscMsg)
    })

    OSCSerialPort.on('error', console.error)

    // Open the port.
    // serialPort.on('open', () => {
    //   OSCSerialPort.open()
    // })
    // OSCSerialPort.open()
  })
})
