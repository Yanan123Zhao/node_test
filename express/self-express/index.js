const http = require('http')
const mixin = require('merge-descriptors')
const Router = require('./Router.js')


function createApplication () {
  function app (req, res) {
    app.handle(req, res)
  }
  mixin(app, proto, false)
  app.init()
  return app
}

const proto = Object.create(null)

proto.listen = function () {
  const server = http.createServer(this)
  return server.listen.apply(server, arguments)
}

proto.init = function (path) {
  if (!this._router) {
    return this._router = new Router(path)  
  }
  return this._router
}
proto.route = function (path) {
  return this._router.route(path)
}
proto.handle = function (req, res) {
  function outer () {
    console.log('end')
  }

  this._router.dispatch.apply(this._router, [...arguments, outer])
}

http.METHODS.forEach((method) => {
  method = method.toLowerCase()
  proto[method] = function (path) {
    this._router[method](path, ...[].slice.call(arguments, 1))
  }
})




module.exports = createApplication