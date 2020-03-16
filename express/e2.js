const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.post('/', function (req, res) {
  console.log(req.body)
})
app.listen(3000)