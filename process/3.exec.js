const {exec, execFile} = require('child_process')
const path = require('path')
/** ================ exec */
// let child = exec('node exec.js a b ', {
//   cwd: path.join(__dirname, './test')
// }, (err, stdout, stderr) => {
//   console.log('err', err)
//   console.log('stdout', stdout)
// })

// setTimeout(() => {
//   child.kill()
// }, 5000);

/** ================ exec file */
let child = execFile('node', ['exec.js', 'a', 'b'], {
  cwd: path.join(__dirname, './test')
}, (err, stdout, stderr) => {
  console.log('err', err)
  console.log('stdout', stdout)
})