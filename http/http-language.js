// accept-language
const http = require('http')

const languageConfig = {
  en: {
    title:'welcome'
  },
  zh: {
    title:'欢迎光临'
  }
}

const server = http.createServer(function (req, res) {
  let languages = req.headers['accept-language']
  console.log('language', languages)
  languages = languages.split(',').map(lanItem => {
    let splits = lanItem.split(';')
    let q = splits[1] ? Number(splits[1].split('=')[1]) : 1
    return {
      name: splits[0],
      q
    }
  }).sort((a, b) => b.q - a.q)
  let language = 'zh'
  for (let i = 0; i < languages.length; i++) {
    if (languageConfig[languages[i].name]) {
      language = languageConfig[languages[i].name]
      break
    }
  }
  res.setHeader('Content-Type', 'text/plain;charset=utf8')
  res.end(language.title)
  return
})

server.listen(8080)