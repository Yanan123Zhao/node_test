const {pathToRegexp} = require('path-to-regexp')
const util = require('util')

function Layer (path, options, fn) {
  const ops = options || {}
  this.handle = fn
  this.name = fn.name || '<anonymouse>'
  this.regexp = {}
  this.regexp.reg = pathToRegexp(path, this.keys = [], ops)
  this.regexp.fast_start = path === '*'
  this.regexp.fast_slash = path === '/'
}

Layer.prototype.match = function (path) {// req.中的路径
  if (path) {
    if (this.regexp.fast_start) {
      return true
    } else if (this.regexp.fast_slash) {
      return true
    } else {
      return Boolean(this.regexp.reg.exec(path))
    }
  }
}
// Layer.prototype.handle_method = function (method, req) {
//   return method.toLowerCase() === req.method.toLowerCase()
// }

Layer.prototype.handle_request = function (req, res, next) {
  // if (!this.handle_method(req)) return
  // try {
    console.log('aaaaaaaaaa', this, util.inspect(this.handle))
    this.handle(req, res, next)
  // } catch (err) {
  //   throw err
  // }
}

module.exports = Layer