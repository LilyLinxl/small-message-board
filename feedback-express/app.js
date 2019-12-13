var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use('/public/', express.static('./public/'))

// view engine setup
app.engine('html', require('express-art-template'))

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
    // routes
app.get('/', (req, res) => {
    res.render('index.html', {
        comments: comments
    })
})
app.get('/post', (req, res) => {
    res.render('post.html')
})

// app.get('/pinglun', (req, res) => {
//     var comment = req.query
//     comment.dateTime = '2019-11-12 11:10:00'
//     comments.unshift(comment)
//     res.redirect('/')

// })

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/pinglun', urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400)
    var comment = req.body
    comment.dateTime = '2019-11-12 11:10:00'
    comments.unshift(comment)
    res.redirect('/')
})

app.listen('3000', () => {
    console.log('running')
})