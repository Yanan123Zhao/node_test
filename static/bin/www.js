#! /usr/bin/env node

const yargs = require('yargs')
const HttpServer = require('../src/index')

let argv = yargs.option('d', {
  alias: 'root',
  demand: false,
  type: 'string',
  default: process.cwd(),
  description: '静态文件根目录'
}).option('h', {
  alias: 'host',
  demand: false,
  type: 'string',
  default: 'localhost',
  description: '监听主机'
}).option('p', {
  alias: 'port',
  demand: false,
  type: 'number',
  default: 3000,
  description: '端口号'
})
// .usage('static-server [options]')
// .example('static-server -p / -h http://192.168.1.7 -p 9000', '在本地9000端口监听服务')
// .help('h')
.argv



const server = new HttpServer(argv)
server.start()