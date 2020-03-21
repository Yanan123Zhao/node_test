const cluster = require('cluster')
const http = require('http')
const cpus = require('os').cpus()

console.log(cluster.isMaster)

if (cluster.isMaster) {
  for (let i = 0; i < cpus.length; i++) {
    cluster.fork()
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker' + worker.process.pid + 'died')
  })
} else {
  const server = http.createServer(function (req, res) {
    res.end('this is end')
  })
  server.listen(8080)
}
