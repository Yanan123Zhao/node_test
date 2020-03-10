const http = require('http')

process.on('message', (msg, server) => {
  if (msg === 'server') {
    const server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html;charset=utf8')
      res.end('从子进程')
    })
    server.listen(server)
  }
})