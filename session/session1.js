const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const users = [
  {
    name: 'a',
    password: '123456'
  }
]

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'));

const identityKey = 'chuangqianmingyueguang'
app.use(session({
  name: identityKey, // cookie的key
  saveUninitialized: false,// 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  secret: 'hello',// 用来对session id相关的cookie进行签名
  cookie: {
    maxAge: 10*1000
  }
}))
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', function (req, res) {
  console.log('req', req.session)
  const sess = req.session
  const loginUser = sess.loginUser
  const isLogined = !!loginUser
  res.render('index', {
    isLogined,
    name: loginUser || ''
  })
})

app.post('/login', function (req, res){
  const user = users.find(function (user) {
    return user.name === req.body.name && user.password === req.body.password
  })

  if (user) {
    req.session.regenerate(function (err) {
      if (err) {
        return res.end('login error')
      }
      req.session.loginUser = user.name
      res.end('login success')
    })
  } else {
    res.end('username or password error')
  }
})

app.get('/logout', function (req, res, next) {
  const sess = req.session
  sess.destroy(function (err){
    if (err) {
      console.log('logout err')
    }
  })
  res.clearCookie(identityKey)
  res.redirect('/')

})

app.listen(8080)