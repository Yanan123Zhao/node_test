const http = require('http')
var httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer()

const config = {
  'b.com': 'http://localhost:9000'
}

http.createServer(function (req, res) {
  const host = req.headers['host']
  if (config[host]) {
    proxy.web(req, res, {
      target: config[host]
    })
  } else {
    res.end(host)
  }
}).listen(80)