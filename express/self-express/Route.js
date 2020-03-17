const methods = require('./methods')
const Layer = require('./Layer.js')
const urlObj = require('url')

function Route (path) {
  this.path = path
  this.stack = []
  this.methods = {}
}


Route.prototype._handle_method = function (req) {
  return Boolean(this.methods[req.method.toLowerCase()])
}

// Route.prototype.get = function (handler) {
//   let layer = new Layer('/', handler)
//   layer.method = 'get'
//   this.methods.get = true
//   this.stack.push(layer)
// }

Route.prototype.dispatch = function (req, res, out) {
  let idx = 0
  const _this = this
  const {pathname} = urlObj.parse(req.url, true)
  function next () {
    if (idx >= _this.stack.length) {
      return out()
    }
    const layer = _this.stack[idx++]
    const {pathname} = urlObj.parse(req.url, true)
    // console.log('pathname********', pathname, _this.path)
    if (
      // layer.match(pathname)
      layer.match(_this.path)
      && _this.methods[req.method.toLowerCase()]
    ) {
      layer.handle_request(req, res, next)
    } else {
      next()
    }
  }
  next()
}

methods.forEach((method) => {
  method = method.toLowerCase()
  Route.prototype[method] = function () {
    this.methods[method] = true
    for (let i = 0 ; i < arguments.length; i++) {
      console.log('*******', arguments[i])
      const layer = new Layer(this.path, {}, arguments[i])
      layer.method = method
      this.stack.push(layer)
    }
    return this
  }
})



module.exports = Route
