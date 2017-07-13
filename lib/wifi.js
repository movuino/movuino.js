'use strict'

const Movuino = require('./Movuino')
const osc = require('osc')

const PORT = 7400

const movuinos = require('./movuinos')

setInterval(() => {
  const now = Date.now()
  movuinos.movuinos.forEach((movuino) => {
    if (!movuino.lastUdpMessage) return
    const delta = now - movuino.lastUdpMessage
    if (delta < 500) return
    movuino.emit('offline')
    movuino.lastUdpMessage = null
  })
}, 0)

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: PORT
})

udpPort.on('message', function ({args}) {
  const id = args.shift()
  let movuino = movuinos.movuinos.find(m => m.id === id)
  if (!movuino) {
    movuino = new Movuino(id)
    movuinos.movuinos.push(movuino)
    movuinos.emit('movuino', movuino)
  }

  movuino.emit('data', args)

  if (!movuino.lastUdpMessage) {
    movuino.emit('online')
  }
  movuino.lastUdpMessage = Date.now()
});

udpPort.open()