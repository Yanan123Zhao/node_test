const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const {p, host, port} = require('./configs')
const {promisify, inspect} = require('util')
const debug = require('debug')('static:index')
const chalk = require('chalk')
const mime = require('mime')
const Handlebars = require('handlebars')
const zlib = require('zlib')
const crypto = require('crypto')
// console.log(debug)
process.env.DEBUG = 'static:*'
class HttpServer {
  constructor (props = {}) {
    this.path = props.root || p
    this.host = props.host || host
    this.port = props.port || port
  }
  start () {
    const server = http.createServer()
    server.on('request', this.request.bind(this))
    server.listen(this.port, (err) => {
      debug(`server is runing${chalk.green(this.host)},${this.port}`)
    })
  }
  async request (req, res) {
    const {pathname} = url.parse(req.url)
    if (pathname === 'favicon.ico') {
      return this.sendError(req, res)
    }
    const sourcePath = path.join(this.path, pathname)
    try {
      const pathInfo = await promisify(fs.stat)(sourcePath)
      if (pathInfo.isDirectory()) { // 文件夹
        this.showHtml(sourcePath, res, pathname)
      } else { // 文件
        // 缓存
        const isUseCache = await this.handleCache(req, res, pathInfo, sourcePath)
        if (isUseCache) return
        const encoding = this.compressStream(req, res)
        // 根据文件类型返回对应的content-type
        res.setHeader('Content-Type', mime.getType(sourcePath) + ';charset=utf8')
        // 压缩
        if (encoding) {
          fs.createReadStream(sourcePath).pipe(encoding).pipe(res)
        } else {
          fs.createReadStream(sourcePath).pipe(res)
        }
      }
    } catch (e) {
      console.error('e', e)
      debug(inspect(e))
      this.sendError(req, res)
    }
  }
  compressStream (req, res) {
    const encoding = req.headers['accept-encoding']
    if (/\bgzip\b/.test(encoding)) {
      res.setHeader('Content-Encoding', 'gzip')
      return zlib.createGzip()
    } else if (/\deflate\b/.test(encoding)) {
      res.setHeader('Content-Encoding', 'deflate')
      return zlib.createDeflate()
    } else {
      return null
    }
  }
  async handleCache (req, res, statsObj, sourcePath) {
    console.log('header', req.headers)
    const ifModifiedSince = req.headers['if-modified-since']
    const ifNoneMatch = req.headers['if-none-match']

    const content = await promisify(fs.readFile)(sourcePath)
    const etag = crypto.createHash('md5').update(content).digest('hex')
    // etag
    if (ifNoneMatch === etag) {
      res.writeHead(304);
      res.end()
      return true
    }
    // last-modified
    if (ifModifiedSince === statsObj.mtime.toGMTString()) {
      res.writeHead(304);
      res.end()
      return true
    } 

    res.setHeader('Etag', etag)
    res.setHeader('Last-Modified', statsObj.mtime.toGMTString())
    return false
  }
  sendError (req, res) {
    res.statusCode = 404
    res.end('没有这个目录')
  }
  async showHtml (sourcePath, res, pathname) {
    const content = await promisify(fs.readFile)(path.resolve(__dirname, '../template/files.html'), 'utf8')
    const template = Handlebars.compile(content)
    
    const files = await promisify(fs.readdir)(sourcePath)
    const data = {
      path: sourcePath,
      files: files.map(file => {
        return {
          name: file,
          url: path.join(pathname, file)
        }
      })
    }
    const html = template(data)
    res.setHeader('Content-Type', 'text/html')
    res.end(html)

  }
}

module.exports = HttpServer
