const Route = require('./Route')
const Layer = require('./Layer')
const methods = require('./methods')
const urlObj = require('url')

function Router (path) {
  this.path = path
  this.stack = []
}

Router.prototype.route = function (path) {
  const route = new Route(path)
  const layer = new Layer(path, {}, function (req, res, next) {
    return route.dispatch(req, res, next)
  })
  layer.route = route
  this.stack.push(layer)
  return route
}

Router.prototype.dispatch = function (req, res, out) {
  let idx = 0
  const _this = this
  function next () {
    if (idx >= _this.stack.length) return out()
    const layer = _this.stack[idx++]
    const {pathname} = urlObj.parse(req.url, true)
    if (
      layer.match(pathname)
      && layer.route
      && layer.route._handle_method(req)
    ) {
      console.log('bbbbbbbbb', layer.handle_request)
      layer.handle_request(req, res, next)
    } else {
      next()
    }
  }
  next()
}

methods.forEach((method) => {
  method = method.toLowerCase()
  Router.prototype[method] = function (fn) {
    let args = [].slice.call(arguments, 0)
    if (typeof fn !== 'function') {
      this.path = fn
      args = args.slice(1)
    }
    console.log('args', args)
    const route = this.route(this.path)
    route[method].apply(route, args)
    return this
  }
})



module.exports = Router