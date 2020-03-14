const http = require('http')

http.createServer((req, res) => {
  const userAgent= req.headers['user-agent']
  console.log('userAgent', userAgent)
}).listen(3000)