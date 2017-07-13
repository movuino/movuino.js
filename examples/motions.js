'use strict'

const m = require('../index')

m.once('movuino', movuino => {
  movuino.on('data', (data) => {
    console.log(data)
  })
})
