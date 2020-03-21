module.exports = function (data = {}, fn) {
  if (data.name === 'hello') {
    return fn('hello')
  }
  return fn(null)
}