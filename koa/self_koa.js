class Koa {
  constructor () {
    this.middlewares = []
  }
  use (fn) {
    this.middlewares.push(fn)
  }


  handleResponse (ctx, res) {
    return () => {
      if (typeof ctx.body === 'string') {
        res.end(ctx.body)
      }
    }
  }

  compose (mws) {
    return function (ctx) {
      return dispatch(0)
      function dispatch (idx) {
        if (idx >= mws.length) return Promise.resolve()
        return Promise.resolve(mws[idx](ctx, function next () {
          return dispatch(idx + 1)
        }))
      }
    }
  }

  callback(req, res){
    const fn = this.compose(this.middlewares)
    // ctx每次请求都要组合一次，因为请求的内容不一样
    const ctx = {req,...req,  res}   
    return fn(ctx)
    .then(this.handleResponse(ctx, res))
    .catch((err) => {
      console.log('err', err)
    })
  }

  listen (port) {
    const middlewares = this.middlewares
    console.log('middlewares', middlewares)
    require('http').createServer(this.callback.bind(this)).listen(port)
  }
}

module.exports = Koa