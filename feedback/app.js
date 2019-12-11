var http = require('http')
var fs = require('fs')
var template = require('art-template')
var url = require('url')
var comments = [{
    name: 'jake',
    message: '天气不错',
    dateTime: '2019-12-1'
}, {
    name: 'jake',
    message: '天气不错',
    dateTime: '2019-12-1'
}, {
    name: 'jake',
    message: '天气不错',
    dateTime: '2019-12-1'
}, {
    name: 'jake',
    message: '天气不错',
    dateTime: '2019-12-1'
}]

http
    .createServer(function(req, res) {
        var parseObj = url.parse(req.url, true)
        var pathname = parseObj.pathname //不包含查询字符串的那部分路径
        if (pathname === '/') {
            fs.readFile('./views/index.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                var htmlStr = template.render(data.toString(), {
                    comments: comments
                })
                res.end(htmlStr)
            })
        } else if (pathname === '/post') {
            fs.readFile('./views/post.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        } else if (pathname.indexOf('/public/') === 0) {
            fs.readFile('.' + pathname, function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        } else if (pathname === '/pinglun') {
            var comment = parseObj.query
            var dt = +new Date()
            comment.dateTime = new Date(dt.valueOf())
            comments.unshift(comment)
                //通过服务器让客户端重定向
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        } else {
            fs.readFile('./views/404.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        }
    })
    .listen(3000, function() {
        console.log("running...")
    })