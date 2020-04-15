Buffer.prototype.split = function (seq) {
  let pos = 0
  let index = -1
  const length = seq.length
  const buffers = []
  while (-1 !== (index = this.indexOf(seq, pos))) {
    console.log('pos', pos, index)
    index !== 0 && buffers.push(this.slice(pos, index))
    pos = index + length
  }
  console.log('pos2', pos)
  pos !== this.length && buffers.push(this.slice(pos))
  return buffers
}

let b = Buffer.from('&&1&&2&&3&&4&&')
console.log(b, b.split('&&'))