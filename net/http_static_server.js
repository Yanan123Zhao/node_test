const http = require('http')
const path = require('path')
const url = require('url')
const {promisify} = require('util')
const zlib = require('zlib')
const fs = require('fs')
const mime = require('mime')

const server = http.createServer(async function (req, res) {
  const {pathname} = url.parse(req.url)
  const filePath = path.join(__dirname, pathname)
  try {
    const fileStat = await promisify(fs.stat)(filePath)
    const acceptEncoding = req.headers['accept-encoding'] || ''
    res.setHeader('Content-Type', mime.getType(filePath))
    if (/\bgzip\b/.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'gzip')
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res)
    } else if (/\deflate\b/.test(filePath)) {
      res.setHeader('Content-Encoding', 'deflate')
      fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res)
    } else {
      fs.createReadStream(filePath).pipe(res)
    }

  } catch (e) {
    res.statusCode = 404
    res.end()
  }
  
})

server.listen(8080)