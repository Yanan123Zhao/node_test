const http = require('http')
var httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer()

http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: 'http://localhost:9000'
  })
}).listen(8000)