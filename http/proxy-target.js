const http = require('http')

http.createServer(function (req, res) {
  res.end('9000, from 8000')
}).listen(9000)