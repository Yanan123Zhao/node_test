const http = require('http')
const logger = require('logger').createLogger('development.log')

const c_server = http.createServer(function (req, res) {
  throw new Error('erro happen')
  res.end('from child' + process.pid)
})
let worker
process.on('message', function (message,tcp) {
  if (message === 'server') {
    worker = tcp
    worker.on('connection', function (socket) {
      c_server.emit('connection', socket)
    })
    
  }
})

process.on('SIGTERM', function () {
  process.exit(1)
})

process.on('uncaughtException', function (err) {
  // 记录下错误
  logger.error(err)
  // 发送自杀信号
  process.send({act: 'suicide'})
  // 停止接收新的连接
  worker.close(function () {
    process.exit(1)
  })
  setTimeout(function () {
    process.exit(1)
  }, 5000)
})