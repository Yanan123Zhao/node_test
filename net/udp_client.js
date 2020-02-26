const dgram = require('dgram')

const socket = dgram.createSocket('udp4')

socket.send('client say hi',41234, 'localhost', function () {
  console.log('client send ok')
})

socket.on('message', function (msg, rinfo) {
  console.log('hh', msg.toString())
})

