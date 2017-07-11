'use strict'

const movuino = require('../index')

movuino.getMovuinos().then((movuinos) => {
  const movuino = movuinos[0]
  movuino.OSCSerialPort.serialPort.on('data', (data) => {
    console.log(data.toString())
  })
  return movuino.setWifi({
    ssid: 'localiot',
    password: 'salutsava',
    host: '192.168.0.100',
  })
})
.catch((err) => {
  console.error(err)
})
