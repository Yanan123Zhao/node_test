const http = require('http')


function createApplication () {
  const allRoutes = [
    {
      method: '*',
      path: '*',
      handler: function (req, res) {
        res.end(`cannot find the route ${req.url}`)
      }
    }
  ]

  function app (req, res) {
    let index = 1
    function next (argString) {
      if (req.url === '/favicon.ico' || index >= allRoutes.length) return allRoutes[0].handler(req, res)
      const currentRoute = allRoutes[index++]
      if (argString) {// 如果出错了，也就是有参数
        if (currentRoute.handler.length === 4) {
          currentRoute.handler(argString, req, res, next)
        } else {
          next(argString)
        }
      } else {
        if (currentRoute.method === 'middleware') {// 如果是中间件
          if ( // 1. 没有传入路由 2. 路径只匹配了开始
            currentRoute.path === '/' || req.url.startsWith(currentRoute.path)
          ) {
            currentRoute.handler(req, res, next)
          } else {
            next()
          }
        } else {// 路由
          // 有路由参数
          // console.log('currentRoute', currentRoute)
          if (currentRoute.params) {
            const regInfo = req.url.match(currentRoute.path)
            console.log(currentRoute, regInfo)
            // 匹配成功
            if (regInfo) {
              const params = {}
              // console.log('123123',req.url, currentRoute.path, req.url.match(currentRoute.path))
              for (let i = 0 ; i < currentRoute.params.length; i++) {
                params[currentRoute.params[i]] = regInfo[i + 1]

              }
              req.params = params
              currentRoute.handler(req, res)
            } else {
              next()
            }
          } else {
            if (
              (currentRoute.method === req.method.toLowerCase() || currentRoute.method === 'all')
              && (currentRoute.path === req.url || req.url === '*')
      
            ) {
              currentRoute.handler(req, res)
            } else {
              if (index < allRoutes.length - 1) {
                next()
              } else {
                allRoutes[0].handler(req, res)
              }
            }
          }
        }
      }
    }
    next()
  }

  // 为所有method绑定方法
  http.METHODS.forEach((method) => {
    method = method.toLowerCase()
    app[method] = function (path, handler) {
      // 需要判断path中是否有参数
      let allParams = {
        method,
        path,
        handler
      }
      const reg = /:([^\/]+)/g
      if (path.match(reg)) {
        allParams.params = path.match(reg) // []，存储所有参数
        // 路径替换成正则
        allParams.path = allParams.path.replace(/:([^\/]+)/g, function () {
          return '([^\/]+)'
        })
      }    
      allRoutes.push(allParams)
    }
  })

  app.all = function (path, handler) {
    allRoutes.push({
      method: 'all',
      path,
      handler
    })
  }

  app.use = function (path, handler) {
    if (typeof path === 'function') { // 没有path
      handler = path
      path = '/'
    }
    allRoutes.push({
      method: 'middleware',
      path,
      handler
    })
  }
  
  app.listen = function () {
    const server = http.createServer(app)
    server.listen.apply(server, arguments)
  }
  return app
}

module.exports = createApplication