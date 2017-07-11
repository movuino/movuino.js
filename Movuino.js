'use strict'

const EventEmitter = require('events')
const osc = require('osc')

class Movuino extends EventEmitter {
  constructor() {
    super()
    this.id = null
    this.OSCSerialPort = null
  }

  attachSerial(path) {
    return new Promise((resolve, reject) => {
      const port = new osc.SerialPort({
        devicePath: path,
        bitrate: 115200,
      })
      port.once('ready', resolve)
      port.once('error', reject)
      port.open();
      this.OSCSerialPort = port
    })
  }

  setWifi(config) {
    this.OSCSerialPort.send({
      address: "/set/wifi",
      args: [
        {type: 's', value: config.ssid},
        {type: 's', value: config.password},
        {type: 's', value: config.host},
      ]
    })
  }

  _rpc(addr) {
    return new Promise((resolve, reject) => {
      const messageListener = (message) => {
        if (message.address !== addr) return
        resolve(message.args)
        this.OSCSerialPort.removeListener('message', messageListener)
      }

      this.OSCSerialPort.on('message', messageListener)

      this.OSCSerialPort.send({
        address: addr,
      })
    })
  }

  getWifi() {
    return this._rpc('/get/wifi').then((args) => {
      const [ssid, password, host] = args
      return {
        ssid, password, host
      }
    })
  }

  getID() {
    return this._rpc('/get/CID').then(args => args[0])
  }
}

module.exports = Movuino
