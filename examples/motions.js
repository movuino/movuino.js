'use strict'

const osc = require('osc')
const PORT = 7400

function loop(values) {
  console.log(values)
}

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: PORT
});

udpPort.on("message", function ({args}) {
  const cid = args.shift()
  loop(args)
});

udpPort.on("error", function (err) {
  console.error(err);
  process.exit(1);
});

udpPort.open();
