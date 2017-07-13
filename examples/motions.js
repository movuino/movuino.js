'use strict'

const m = require('../index')

m.once('movuino', movuino => {
  movuino.once('online', () => {
    movuino.on('data', (data) => {
      console.log(data)
    })
  })
})
