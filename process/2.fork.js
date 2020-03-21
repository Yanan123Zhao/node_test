const {fork} = require('child_process')
const path = require('path')
const fs = require('fs')
const http = require('http')
const os = require('os')

/** =================== fork */
// const child = fork('test1.js', [], {
//   cwd: path.join(__dirname, 'test')
// });

// child.send('hello owrld')

// child.on('message', (data) => {
//   console.log(data)
// })

/*======================== fork tcp server */
// const server = require('net').createServer(function (socket){
//   socket.end('handle by parent')
// })

// const child_process = fork('server.js', [], {
//   cwd: path.join(__dirname, 'test')
// })

// server.listen(8080, function () {
//   child_process.send('server', server)
// })

/*======================== fork http server http server 貌似不支持*/

const server = http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html;charset=utf8')
  res.end('from father')
})
server.listen(8080, function () {
  for(let i = 0; i < os.cpus.length; i++) {
    const child = fork('server.js', [], {
      cwd: path.join(__dirname, 'test')
    })
    child.send('server', server)
  }
})


