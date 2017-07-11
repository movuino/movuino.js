'use strict'

const {promisify} = require('util')
const serial = require('serialport')
const usb = require('usb')
const EventEmitter = require('events')
const osc = require('osc')
const Movuino = require('./Movuino')

const MOVUINO_VENDOR_ID = '0x10c4'
const MOVUINO_PRODUCT_ID = '0xea60'

const serialList = promisify(serial.list)

async function listSerialMovuinos() {
  const devices = await serialList()
  return devices
    .filter(device => device.vendorId === MOVUINO_VENDOR_ID && device.productId === MOVUINO_PRODUCT_ID)
}

module.exports.getMovuinos = async function() {
  const devices = await listSerialMovuinos()

  // FIXME
  const movuinos = devices.map((device) => {
    const movuino = new Movuino()
    movuino.comName = device.comName
    return movuino
  })

  await Promise.all(
    movuinos.map(movuino => {
      return movuino.attachSerial(movuino.comName).then(() => {
        return movuino.getID().then((id) => {
          movuino.id = id
          return movuino
        })
      })
    })
  )

  return movuinos
}

module.exports.listSerialMovuinos = listSerialMovuinos


usb.on('attach', (device) => {
  console.log(device)
})
