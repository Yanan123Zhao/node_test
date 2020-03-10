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

/*======================== fork server */

const server = http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html;charset=utf8')
  res.end('从父进程')
})
server.listen(8080)
for(let i = 0; i < os.cpus.length; i++) {
  const child = fork('server.js', [], {
    cwd: path.join(__dirname, 'test')
  })
  child.send('server', server)
}

