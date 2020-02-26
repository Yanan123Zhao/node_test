const net = require('net')
const clients = {}
let num = 0

const server = net.createServer(function (socket) {
  const key = socket.remoteAddress + socket.remotePort
  socket.setEncoding('utf8')
  socket.write('hello' + key + '\r\n')
  if (!clients[key]) {
    clients[key] = {
      name: 'noName' + (num++),
      socket
    }
  }

  socket.on('data', function (data) {
    console.log('data', data)
    data = data.replace(/\r\n/, '')
    const type = data.slice(0, 1)
    switch(type){
      case 'b': // 广播
        const message = data.slice(2)
        broadcast(message)
        break
      case 'c': // 私聊
        const [_, othername, content] = data.split(':')
        sendTo(othername, content)
        break
      case 'n': // 修改名字
        const newName = data.slice(2)
        clients[key].name = newName
        break
      case 'l': // 列出成员列表
        list()
        break
      default:
        socket.write('there is no command' + '\r\n')
    }
  })

  function broadcast (message) {
    for (let currentKey in clients) {
      if (currentKey !== key) {
        clients[currentKey].socket.write(message + '\r\n')
      }
    }
  }

  function sendTo (othername, message) {
    for (let currentKey in clients) {
      const {name} = clients[currentKey]
      if (name === othername) {
        clients[currentKey].socket.write(clients[key].name+ '-' + message + '\r\n')
        return
      }
    }
    clients[currentKey].socket.write('there has no this client \r\n')
  }
  function list () {
    let names = []
    for (let currentKey in clients) {
      names.push(clients[currentKey].name)
    }
    socket.write(names.join('\r\n') + '\r\n')
  }
})

server.listen(8080) 