const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

function gzip (src) {
  fs.createReadStream(src)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(path.resolve(__dirname, src + '.gz')))
}

// gzip(path.resolve(__dirname, './requst_head.txt'))

function ungzip (src) {
  fs.createReadStream(src)
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream(path.resolve(__dirname, path.basename(src, '.gz'))))
}

ungzip(path.resolve(__dirname, './requst_head.txt.gz'))