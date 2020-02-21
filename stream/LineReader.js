const fs = require('fs')
const EventEmitter = require('events');
const util = require('util')

const NEW_LINE = 0x0A
const RETURN = 0x0D

function LineReader (path) {
  EventEmitter.call(this)
  this.reader = null
  this.on('newListener', (event, listener) => {
    if (event === 'newLine') {
      this.reader = fs.createReadStream(path)
      const buffers = []
      this.reader.on('readable', () => {
        let char
        while (null !== (char = this.reader.read(1))) {
          switch (char[0]) {
            case NEW_LINE:
              this.emit('newLine', Buffer.concat(buffers))
              buffers.length = 0
              break
            case RETURN:
              this.emit('newLine', Buffer.concat(buffers))
              buffers.length = 0
              const nChar = this.reader.read(1)
              if (nChar[0] !== NEW_LINE) {
                buffers.push(nChar)
              }
              break
            default:
              buffers.push(char)
          }
        }
      })
      this.reader.on('end', () => {
        this.emit('newLine', Buffer.concat(buffers))
        buffers.length = 0
        this.emit('end')
      })
    }
  })
  
}

util.inherits(LineReader, EventEmitter)

// module.exports = LineReader

const lineR = new LineReader('./1.txt')

lineR.on('newLine', (data) => {
  console.log('data', data)
})

lineR.on('end', () => {
  console.log('end')
})