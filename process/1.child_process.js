const {spawn} = require('child_process')
const path = require('path')
const fs = require('fs')
/** ======================== pipe inherit */
const t1 = spawn('node', ['test1.js'], {
  cwd: path.join(__dirname, 'test'),
  // stdio: [process.stdin, process.stdout]
  stdio: 'pipe'
})

t1.stdout.on('data', data => {
  console.log(data.toString())
})

t1.stderr.on('data', data => {
  console.log(data.toString())
})

t1.on('close', () => {
  console.log('close')
})

t1.on('exit', () => {
  console.log('exit')
})

t1.on('error', () => {
  console.log('error')
})
/** =======================ipc */
// const t2 = spawn('node', ['test1.js'], {
//   cwd: path.join(__dirname, 'test'),
//   stdio: ['ipc', 'pipe', 'pipe']
// })

// t2.send('hello')
// t2.on('message', (msg) => {
//   console.log('yyyyy', msg)
// })

/** =============== 文件描述符 && detach */
const fd = fs.openSync(path.join(__dirname, './test/msg.txt'), 'w', 0o666)
const child = spawn('node', ['test1.js'], {
  cwd: path.join(__dirname, 'test'),
  // stdio: [process.stdin, process.stdout]
  stdio: ['inherit', fd, 'inherit'],
  detached: true
})

child.unref()