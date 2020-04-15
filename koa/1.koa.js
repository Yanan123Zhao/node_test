// const Koa = require('koa')
const Koa = require('./self_koa')
const path = require('path')
const convert = require('koa-convert')
// const bodyParser = require('koa-bodyparser')
const bodyParser = require('koa-better-body')
// const {betterBody} = require('./middlewares/1.better-body')
const app = new Koa()

// app.use(bodyParser())
// app.use(convert(bodyParser({
//   uploadDir: path.join(__dirname, 'uploads'),
//   keepExtensions: 'true'
// })))
// app.use(betterBody)
app.use(async function (ctx, next) {
  if (ctx.method === 'GET' && ctx.url === '/user') {
    ctx.body = `
      <form method='POST' enctype='multipart/form-data'>
        <input type='text' name='username'/>
        <input type='file' name='file'/>
        <input type='submit'/>
      </form>
    `
    ctx.res.setHeader('Content-Type', 'text/html')
  //   ctx.res.end(`
  //   <form method='POST' enctype='multipart/form-data'>
  //     <input type='text' name='username'/>
  //     <input type='file' name='file'/>
  //     <input type='submit'/>
  //   </form>
  // `)
  } else {
    await next()
  }
})

app.use(async function (ctx, next) {
  if (ctx.method === 'POST' && ctx.url === '/user') {
    // ctx.body = ctx.request.body
    // console.log('ctx.request.fields', ctx.request.fields)
    ctx.body = 'post'
  } else {
    await next()
  }
})

app.listen(3000)