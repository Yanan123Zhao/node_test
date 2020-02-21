// 手写可写流
const fs = require('fs')
const EventEmitter = require('events');

class CreateWriteStream extends EventEmitter {
  constructor (path) {
    super(path)
    this.path = path
    this.fd = null
    this.highWaterMark = 3
    this.open()
    this.writing = false
    this.length = 0
    this.buffers = []
  }

  open () {
    fs.open(this.path, 'w', 0o666, (err, fd) => {
      if (err) {
        this.emit('err', err)
      } else {
        this.fd = fd
        this.emit('open', fd)
      }
    })
  }

  write (chunk, encoding, cb) { 
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    this.length += chunk.length
    if (this.writing) {
      this.buffers.push(chunk)
    } else {
      this.writing = true
      this._write(chunk, 'utf8', () => this.clearBuffer())
    }
    return this.length < this.highWaterMark
  }
  clearBuffer () {
    const current = this.buffers.shift()
    if (!current) {
      this.writing = false
      this.emit('drain')
    } else {
      this._write(current, 'utf8', () => this.clearBuffer())
    }
  }
  _write (chunk, encoding, cb) {
    if (typeof this.fd !== 'number') {
      this.once('open', () => {
        this._write(chunk, encoding, cb)
      })
      return
    }

    fs.write(this.fd, chunk, (err, bytesWritten) => {
      console.log('bytesWritten', bytesWritten)
      this.length -= bytesWritten
      cb()
    })
  }
}

// module.exports = CreateWriteStream

let n = 9
function write (path) {
  const ws = new CreateWriteStream(path, {
    highWaterMark: 3
  })
  ws.on('open', () => {console.log('open')})
  function f (num) {
    let flag = true
    while (flag && num >= 0) {
      flag = ws.write('' + num--)
      console.log('flag', flag)
    }
    ws.once('drain', () => {
      console.log('drain')
      f(num)
    })
  }
  f(n)
  
}

write('./1.txt')