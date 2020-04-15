const middlewares = [
  async function (name, next) {
    console.log('name')
    // await next()
    return next()
  },
  async function (name, next) {
    console.log('name111111111')
    await next()
    // return next()
  }
]

function compose (middlewares) {
  return dispatch(0)
  function dispatch (i) {
    const fn = middlewares[i]
    if (!fn) {
      return Promise.resolve('end')
    }
    return Promise.resolve(fn('123', () => {
      return dispatch(i+1)
    }))
  }
}

compose(middlewares).then((...args) => {
  console.log('args', args)
})



function cde () {
  console.log('3333333')
  return 2222
}
function abc () {
  console.log('3333333')
  return Promise.resolve(cde())
}
function text () {
  return Promise.resolve(abc())
}

text().then((...args) => {console.log('args', args)})