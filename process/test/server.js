const http = require('http')
/*======================== fork tcp server */
// process.on('message', (msg, server) => {
//   if (msg === 'server') {
//     console.log('mag', msg)
//     server.on('connection', function (socket) {
//       socket.end('handle by child')
//     })
//   }
// })

/*======================== fork http server */
process.on('message', (msg, server) => {
  if (msg === 'server') {
    const child_server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html;charset=utf8')
      res.end('from child')
    })
    child_server.listen(server)
  }
})