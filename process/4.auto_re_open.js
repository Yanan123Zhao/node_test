// 自动重启子进程
var fork = require('child_process').fork
var cpus = require('os').cpus()

const server = require('net').createServer()
server.listen(8080)

const workers = {}

/** 判断是否重启过于频繁 start */
const during = 60000
const limit = 10
const restarts = []
let length

function isTooFrequenty() {
  const time = Date.now()
  length = restarts.push(time)
  if (length > limit) {
    restarts = restarts.slice(limit * -1)
  }
  return restarts.length >= limit && restarts[restarts.length - 1] - restarts[0] < during
}
/** 判断是否重启过于频繁 end */

function createWorker() {
  if (isTooFrequenty) {
    process.emit('giveup', length, during)
  }
  const worker = fork('4.worker.js',  [], {
    cwd: __dirname
  })
  worker.on('message', function (message) {
    // 如果是自杀信号，则创建一个新的线程
    if (message.act === 'suicide') {
      console.log('child_process ' + worker.pid +' suicide')
      createWorker()
    }
  })
  worker.on('exit', function () {
    console.log('worker '+ worker.pid + ' exit')
    delete workers[worker.pid]
    // createWorker()
  })
  worker.send('server', server)
  workers[worker.pid] = worker
  console.log('create new child_process  ' + worker.pid)
}

for (let i = 0; i < cpus.length; i++) {
  createWorker()
}

process.on('exit', function () {
  console.log('main process exit')
  for (let pid in workers) {
    workers[pid].kill()
  }
})

