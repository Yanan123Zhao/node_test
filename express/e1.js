// const express = require('express')
const express = require('./self-express/index')
const app = express()
const util = require('util')

// app.use(function (req, res, next) {
//   console.log('index')
//   next()
// })

// let data = {
//   id: 1,
//   name: 'hello',
//   age: 10
// }

// app.get('/user/:id/:age', function (req, res) {
//   res.end(util.inspect(req.params))
// })
// const user = app.Router()
// user.get('/1', function (req, res) {
//   res.end('userserser')
// })
// app.use('/user',user)
// app.get('/age', function (req, res) {
//   res.end('age')
// })
// app.use(function (req, res, next) {
//   next('has some wrong')
// })

// app.use(function (err, req, res, next) {
//   res.end(err)
// })

// app.param('id', function (req, res, next, id) {
//   req.user = {
//     id,
//     name: 'hello'
//   }
//   next()
// })

// app.route('/user/:id').get(function (req, res) {
//   console.log('req.params', req.params, req.user)
//   res.end('user')
// })

app.post('/user', function (req, res) {
  let buffers = [];
  req.on('data', function (data) {
      buffers.push(data);
  });
  req.on('end', function () {
    const result = Buffer.concat(buffers).toString()
    res.setHeader("Content-Type", "text/plain; charset=utf8")
    console.log('result', result)
    res.end(result)
  })
})

app.listen(3000)