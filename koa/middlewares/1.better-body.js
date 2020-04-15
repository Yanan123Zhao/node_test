const Koa = require('koa')
const path = require('path')
const queryString = require('querystring')
const fs = require('fs')
const uuid = require('uuid')
const app = new Koa()
app.listen(3000)

Buffer.prototype.split = function (seq) {
  let pos = 0
  let index = -1
  const length = seq.length
  const buffers = []
  while (-1 !== (index = this.indexOf(seq, pos))) {
    index !== 0 && buffers.push(this.slice(pos, index))
    pos = index + length
  }
  pos !== this.length && buffers.push(this.slice(pos))
  return buffers
}

app.use(async function (ctx, next) {
  if (ctx.method === 'GET' && ctx.url === '/user') {
    ctx.body = `
      <form method='POST' enctype='multipart/form-data'>
        <input type='text' name='username'/>
        <input type='file' name='file' />
        <input type='submit'/>
      </form>
    `
  } else {
    await next()
  }
})

app.use(async function (ctx, next) {
  if (ctx.method === 'POST' && ctx.url === '/user') {
    const field = await betterBody(ctx)
    ctx.request.field = field
    ctx.body = field
  } else {
    await next()
  }
})
 
function betterBody (ctx) {
  return new Promise(function (resolve, reject) {
    const reqContentType = ctx.headers['content-type']
    const boundary = reqContentType.match(/boundary=(.+)/)[1]
    if (reqContentType.includes('multipart/form-data')) {
      const buffers = []
      ctx.req.on('data', function (data) {
        buffers.push(data)
      })
      ctx.req.on('end', function () {
        const body = Buffer.concat(buffers)
        bodyArr = body.split('--' + boundary)
        bodyArr = bodyArr.slice(0, -1)
        const field = {}
        bodyArr.forEach((dataItem) => {
          let [desc, data]= dataItem.split('\r\n\r\n')
          desc = desc.toString()
          if (desc.includes('filename=')) { // 文件
            // desc分为两部分
            const [,descLine1, descLine2]= desc.split('\r\n')
            const descLine1Obj = queryString.parse(descLine1, '; ')
            const descLine2Obj = queryString.parse(descLine2, '; ')
            field.files = [
              {
                ...descLine1Obj,
                ...descLine2Obj
              }
            ]
            fs.writeFileSync(path.join(__dirname, '../uploads', uuid.v4()), data, 'utf8')
          } else { // 正常数据
            const descObj = queryString.parse(desc, '; ')
            field[descObj.name] = data
          }
        });
        resolve(field)
      })
    }
  })
}

/**
 * ------WebKitFormBoundaryYoSq4HLU5JSdHA8Y
  Content-Disposition: form-data; name="username"

  12
  ------WebKitFormBoundaryYoSq4HLU5JSdHA8Y
  Content-Disposition: form-data; name="file"; filename="301文件拷贝申请审批.doc"
  Content-Type: application/msword

  xxxxxxxxx
  ------WebKitFormBoundaryYoSq4HLU5JSdHA8Y--
 */