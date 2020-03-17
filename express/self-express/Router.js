const Route = require('./Route')
const Layer = require('./Layer')
const methods = require('./methods')
const urlObj = require('url')
const mixin = require('merge-descriptors')

function Router (path) {
  function router (req, res, next) {

  }
  router.path = path
  router.stack = []
  router.params = {}
  mixin(router, proto, false)
  return router
}

const proto = Object.create(null)

proto.route = function (path) {
  const route = new Route(path)
  const layer = new Layer(path, {}, function (req, res, next) {
    return route.dispatch(req, res, next)
  })
  layer.route = route
  this.stack.push(layer)
  return route
}

proto.dispatch = function (req, res, out) {
  let idx = 0
  const _this = this
  let dropUrl = ''
  
  function next (err) {
    if (idx >= _this.stack.length || req.url === '/favicon.ico') return out()
    const layer = _this.stack[idx++]
    let {pathname} = urlObj.parse(req.url, true)
    console.log('path', pathname, layer.path)
    if (
      layer.match(pathname)
      || (!layer.route && pathname.startsWith(layer.path)) // 中间件
      || (layer.route && pathname.endsWith(layer.path)) // 子路由
    ) {
      req.params = layer.params || {}
      _this.process_params.call(_this, layer, req, res, () => {})
      if (layer.route && layer.route._handle_method(req)) {// 路由
        // console.log('bbbbbbbbb')
        layer.handle_request(req, res, next)
      } else {// 中间件
        // console.log('aaaaaaaaa')
        if (err) {
          layer.handle_error(err, req, res, next)
        } else {
          layer.handle_request(req, res, next)
        }
      }     
    } else {
      next()
    }
  }
  next()
}

methods.forEach((method) => {
  method = method.toLowerCase()
  proto[method] = function () {
    let args = [].slice.call(arguments, 0)
    let path = args.shift()
    if (typeof path === 'function') {
      args = args.unshift(path)
      path = ''
    }
    const route = this.route(path)
    route[method].apply(route, args)
    return this
  }
})

proto.use = function (path, fn) {
  if (typeof path === 'function') {
    fn = path
    path = '/'
  }
  this.path = path
  const layer = new Layer(path, {}, fn)
  layer.route = void 0
  this.stack.push(layer)
}

proto.param = function (name, fn) {
  (this.params[name] = this.params[name] || []).push(fn)
}

proto.process_params = function (layer, req, res, done) {
  if (layer.keys.length === 0) {
    done()
  }
  const _this = this
  let i = 0
  let callbackI = 0
  let cbs
  let value
  let name

  function params () {
    if (i >= layer.keys.length) return done()
    const key = layer.keys[i++]
    name = key.name
    value = layer.params[name]
    cbs = _this.params[name]
    callbackParams()
  }

  function callbackParams () {
    if (callbackI >= cbs.length) return params()
    const fn = cbs[callbackI++]
    if (fn) {
      return fn(req, res, callbackParams, value, name)
    }
  }
  params()
}

module.exports = Router