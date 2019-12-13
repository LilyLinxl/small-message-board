# 06-使用Express重写留言本案例
+ 1.获取并渲染评论页面和发表页面
```javascript
app.get('/', function(req, res) {
    res.render('index.html', {
        comments: comments
    })
})
app.get('/post', function(req, res) {
    res.render('post.html')
})
```
+ 2.获取到发表评论的表单数据
```javascript
app.get('/pinglun', (req, res) => {
    var comment = req.query
    comment.dateTime = '2019-11-12 11:10:00'
    comments.unshift(comment)
    res.redirect('/')
})
```
+ res.redirect('/')相当于
res.statusCode = 302
res.setHeader('Location', '/')
+ req.query只能获取get请求路径中的查询字符串

# 07-在Express中配置解析表单post请求体数据
get 是用req.query来获取查询字符串的
Express中没有内置的获取post表单的模块，需要安装第三方包body-parser
```javascript
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
})

```
//配置完后，req请求对象上会多一个属性body。
//req.body用来获取表单post请求体数据
# 08-crud-起步
增加(Create)、读取(Retrieve)、更新(Update)和删除(Delete)
# 09-从文件种读取数据
```javascript
app.get('/', (req, res) => {
    //把读取的文件按照utf-8编码
    //从文件中读取的数据是字符串所以要手动转化为对象
    fs.readFile('./db.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Sever error.')
        }
        res.render('index.html', {
            tables: [
                '条形图', '柱状图', '饼图', '折线图'
            ],
            students: JSON.parse(data).students
        })
    })

})
```
# 10-CRUD-设计路由

| 请求方法  |     请求路径      | get 参数  |           post 参数            |       备注       |
|----------|------------------|----------|--------------------------------|------------------|
| GET      | /studens         |          |                                | 渲染首页         |
| GET      | /students/new    |          |                                | 渲染添加学生页面 |
| POST     | /studens/new     |          | name、age、gender、hobbies     | 处理添加学生请求 |
| GET      | /students/edit   | id       |                                | 渲染编辑页面     |
| POST     | /studens/edit    |          | id、name、age、gender、hobbies | 处理编辑请求     |
| GET      | /students/delete | id       |                                | 处理删除请求     |
# 11-路由模块的提取
## 11.1 不用express的方式
routes将所有路由放在一个函数中进行导出
并将app作为参数传入routes

- app.js
+ 1.var router = require('./routers')
导入routers
+ 2.router(app)将app作为参数传入router（是一个函数）
- routers.js
module.exports = function(app){
  路由
}
将函数挂载到exports上进行导出
## 11.2 用express的方式
- router.js
导入express
+ 1.创建一个路由容器
var router = express.Router()
+ 2.把路由都挂载到router路由容器中
router.get('/studens', (req, res) => {})
+ 3.把router导出
module.exports = router

- app.js
app.use(router)
把路由容器挂载到app服务中

- app.js的职责：
启动服务做一些服务相关配置 
  模板引擎 
  body-parser 
  解析表单post请求体 
  提供静态资源服务
挂载路由
监听端口启动服务
- router.js的职责：
处理路由
根据不同的请求方法+请求路径设置具体的请求处理函数
# 12-处理添加页面及配置body-parser中间件
配置模板引擎和 body-parser 一定要在app.use(router)挂载路由之前
添加学生信息--post请求
1.获取表单数据
2.处理，将数据保存到db.json 文件中用以持久化
3.发送响应
先读取出来，转成对象，然后往对象中push数据
然后把对象转为字符串，然后把字符串再次写入文件
# 13-封装提取Student数据操作模块
封装异步api：
获取异步操作结果必须通过回调函数来获取
```javascript
function fn(callback) {
    setTimeout(function() {
        var data = 'hello'
        callback(data)
    }, 1000)
}

fn(function(data) {
    console.log(data)
})
```
获取所有学生列表
添加保存学生
+ 1.读取文件数据，转为对象
+ 2.获取表单数据，将表单数据添加到对象中（处理id唯一的问题）
+ 3.再将对象转化为字符串，写入文件


**回调函数总结：**
回调函数的参数包括，增删改查所需要的数据以及获取到数据之后执行的操作（函数）
**增删改查操作总结：**
+ 1.获取增删改查需要的数据
+ 2.根据第一步的数据执行相应的操作
+ 3.根据操作结果发送响应的数据

# 14.自己编写的步骤
模块如何划分：模块职责单一
+ 处理模板
+ 配置开放静态资源
+ 简单路由：/students渲染静态页出来
+ 路由设计
+ 提取路由模块
+ 由于接下来一系列的业务操作都需要处理文件数据，所以我们需要封装student.js
+ 先写好student.js文件结构
 - 查询所有学生列表的api find
 - findById
 - save
 - updateById
 - deleteById
+ 实现具体功能
 - 通过路由收到请求
 - 接收请求中的数据(get,post)
    req.query req.body
 - 调用数据操作api处理数据
 - 根据操作结果给客户端发送响应

