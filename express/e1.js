// const express = require('express')
const express = require('./self-express/index')
const app = express()
const util = require('util')

// app.use('/user', function (req, res, next) {
//   // res.end('/user')
//   console.log('user')
//   next('出错了')
// })

// app.use(function (req, res, next) {
//   // res.end('/index')
//   console.log('index')
// })

// app.use(function(err, req, res, next){
//   console.log('err', err)
// })
// let data = {
//   id: 1,
//   name: 'hello',
//   age: 10
// }

// app.get('/user/:id/:age', function (req, res) {
//   res.end(util.inspect(req.params))
// })
app.get('/user', function (req, res, next) {
  // res.end('user')
  console.log('第一个')
  next()
}, function (req, res) {
  res.end('user')
})
// app.route('/user').get(function (req, res) {
//   res.end('user')
// })
app.listen(3000)