'use strict'

const {promisify} = require('util')
const usb = require('usb')
const serial = require('serialport')
const Movuino = require('./Movuino')
const listSerial = promisify(serial.list)
const osc = require('osc')

const ID_VENDOR = 4292
const ID_PRODUCT = 60000
const MOVUINO_VENDOR_ID = '0x10c4'
const MOVUINO_PRODUCT_ID = '0xea60'

const movuinos = require('./movuinos')

function isUSBMovuino(device) {
  const desc = device.deviceDescriptor
  return desc.idVendor === ID_VENDOR && desc.idProduct === ID_PRODUCT
}

function isSerialMovuino(device) {
  return device.vendorId === MOVUINO_VENDOR_ID && device.productId === MOVUINO_PRODUCT_ID
}

async function listSerialMovuinos() {
  const devices = await listSerial()
  return devices
    .filter(device => isSerialMovuino(device))
}

function getId(path) {
  return new Promise((resolve, reject) => {
    const port = new osc.SerialPort({
      devicePath: path,
      bitrate: 115200,
    })

    const messageListener = (message) => {
      if (message.address !== '/get/id') return
      port.removeListener('message', messageListener)
      port.close()
      resolve(message.args[0])
    }

    port.on('message', messageListener)

    port.on('ready', () => {
      port.send({
        address: '/get/id',
      })
    })

    port.open()
  })
}

listSerialMovuinos().then(devices => {
  devices.forEach((device) => {
    getId(device.comName).then((id) => {
      let movuino = movuinos.movuinos.find(m => m.id === id)
      if (!movuino) {
        movuino = new Movuino(id)
        movuinos.movuinos.push(movuino)
        movuinos.emit('movuino', movuino)
      }

      movuino.comName = device.comName
      movuino.emit('plugged')
    })
  })
})

usb.on('detach', (device) => {
  if (!isUSBMovuino(device)) return

  listSerialMovuinos().then(devices => {
    movuinos.movuinos.forEach(movuino => {

      // ignore unplugged movuinos
      if (movuino.comName === null) return

      // ignore plugged movuinos
      if (devices.find((d => d.comName === movuino.comName))) return

      movuino.emit('unplugged')
      movuino.comName = null
    })
  })
})

usb.on('attach', (device) => {
  if (!isUSBMovuino(device)) return

  listSerialMovuinos().then(devices => {
    devices.forEach((device) => {

      // ignore already attached devices
      if (movuinos.movuinos.find(m => m.comName === device.comName)) return

      getId(device.comName).then((id) => {
        let movuino = movuinos.movuinos.find(m => m.id === id)
        if (!movuino) {
          movuino = new Movuino(id)
          movuinos.movuinos.push(movuino)
          movuinos.emit('movuino', movuino)
        }
        movuino.comName = device.comName
        movuino.emit('plugged')
      })
    })
  })
})