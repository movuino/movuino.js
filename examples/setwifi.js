'use strict'

const m = require('../index')

m.once('movuino', movuino => {
  movuino.once('plugged', () => {
    movuino.attachSerial()
    .then(() => {
      return movuino.setWifi({
        ssid: 'ssid',
        password: 'password',
        host: '192.168.1.25',
      })
    })
    .catch((err) => {
      console.error(err)
    })
  })
})
