/*=================== inherit */
// console.log('in test1.js')

/** =================  ipc */
// process.stdout.on('data', (data) => {
//   console.log('test', data.toString())
// })
// process.stdout.on('data', function (data) {
//   console.log('test1', data.toString())
// })
process.on('message', (msg) => {
  process.send('test1' + msg)
})

/** ================  pipe */
// process.stdout.write('12312312')

/** =============== 文件描述符 && detach */
// let n = 0
// let timer = setInterval(() => {
//   if (n > 100) {
//     clearInterval(timer)
//     timer = null
//   }
//   process.stdout.write(`${new Date()}`)
// }, 100)