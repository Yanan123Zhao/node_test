const assert = require('assert')
const fs = require('fs')
const path = require('path')
const testFile = require('./testFile/1.testFile')

describe('test testFile', function () {
  it('testFile 1', function () {
    const data = {name: 'hello'}
    testFile(data, function (arg) {
      assert.equal(arg, 'hello')
    })
  })
  it('testFile 2', function () {
    testFile({}, function (arg) {
      assert.equal(arg, null)
    })
  })
})