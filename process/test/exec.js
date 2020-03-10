// let n = 0
// let timer = setInterval(() => {
//   n++
//   if (n < 10) {
//     process.stdout.write('1')
//   } else {
//     clearInterval(timer)
//   }
// }, 100)
// process.on('SIGTERM', function () {
//   process.stdout.write(arguments)
// })

process.argv.forEach(element => {
  console.log(element)
});