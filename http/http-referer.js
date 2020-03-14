// referer 防盗链，判断图片的referer与req.url是否一致

const http = require('http')  
const url = require('url')
const fs = require('fs')
const path = require('path')

const whiteList = [
  '192.168.2.161',
  'localhost'
]

const server = http.createServer(function (req, res) {
  let refer = req.headers['referer'] || req.headers['refer']
  refer = url.parse(refer, true).hostname
  let serverUrl = url.parse(req.url, true).hostname
  if (refer !== serverUrl && !whiteList.includes(refer)) {
    // 可以放个forbidden图片
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    res.end('防盗操作')
    return
  }
  res.setHeader('Content-Type', 'images/png;charset=utf8')
  fs.createReadStream(path.join(__dirname, './images/danyu.png')).pipe(res)
  return
})

server.listen(8080)