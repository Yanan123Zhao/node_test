// 配合middleware 文件夹内容
let http = require('http');
let zlib = require('zlib');
// let iconv = require('iconv-lite');
let options = {
    host: 'localhost',
    port: 3000,
    method: 'POST',
    path: '/user',
    headers: {
        'Content-Type': "text/plain; charset=utf8",
        // "Content-Encoding": "gzip"// 代表此请求体是经过压缩过的
    }
}
let req = http.request(options, function (response) {
    response.pipe(process.stdout);
});
// let body = iconv.encode('珠峰培训', 'gbk');
let body = '123'
zlib.gzip(body, function (err, data) {
    // req.write(), req.end向服务器发送请求
    req.end('123');
});

