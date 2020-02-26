const dgram = require('dgram')

const socket = dgram.createSocket('udp4')

socket.bind(41234, 'localhost')

socket.on('message', function (msg, rinfo) {
  console.log('mm', msg.toString())
  setTimeout(() =>{
    socket.send('hi', rinfo.port, rinfo.address, function () {
      console.log('server send ok')
    })
  }, 1000)
})

