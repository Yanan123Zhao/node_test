const http = require('http')
const fs= require('fs')
const path = require('path')
const {StringDecoder} = require('string_decoder')

// const server = http.createServer(function (req) {

// })

// server.listen(8080)

//----start

function parse (requestReader, callback) {
  const decoder = new StringDecoder()
  function onRead () {
    let buf
    let buffers = []
    while (null !== (buf = requestReader.read())) {
      buffers.push(buf)
      const result = Buffer.concat(buffers)
      const str = decoder.write(result)
      console.log('str', str)
      if (/\r\n\r\n/.test(str)) {
        let values = str.split(/\r\n\r\n/)
        let headers = values.shift()
        const parsedHeaders = parseHead(headers)
        Object.assign(requestReader, parsedHeaders)
        console.log('values', values.join('\r\n\r\n'))
        requestReader.removeListener('readable', onRead)
        requestReader.unshift(Buffer.from(values.join('\r\n\r\n')))
        return callback(requestReader)
      }
    }
  }
  requestReader.on('readable', onRead)
}

function parseHead (headerString) {
  const headers = headerString.split(/\r\n/)
  const line = headers.shift()
  // TODO
  const resultHeader = {}
  let info
  while(info = headers.shift()) {
    const key = info.split(': ')
    resultHeader[key[0]] = key[1]
  }
  console.log('resultHeader', resultHeader)
  return {
    headers: resultHeader
  }
}

parse(fs.createReadStream(path.resolve(__dirname, './requst_head.txt')), function (req, res) {
  console.log('header', req.headers)
  // console.log('req', req)
  req.on('data', function (data) {
    console.log('dddddata', data)
  })
  req.on('end', function () {
    console.log('传递数据结束')
  })
})

