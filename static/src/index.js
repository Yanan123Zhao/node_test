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
      console.log(chalk('server is runing', this.host, this.port))
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
        res.setHeader('Content-Type', mime.getType(sourcePath))
        fs.createReadStream(sourcePath).pipe(res)
      }
    } catch (e) {
      console.error('e', e)
      debug(inspect(e))
      this.sendError(req, res)
    }
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
