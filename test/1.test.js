const assert = require('assert')
const fs = require('fs')
const path = require('path')

describe('test indexof', function () {
  it('indexof 1', function () {
    assert.equal([1,2,3].indexOf(1), 0)
  })
})

describe('test async function', function () {
  it('async 1', function (done) {
    fs.readFile(path.join(__dirname, '../package.json'), function (err, data) {
      assert.equal(err, null)
      done()
    })
  })
})