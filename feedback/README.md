### 留言板
#### 1 app.js ->app application 应用程序
把当前模块所有的依赖项都声明再文件模块最上面
为了让目录结构保持统一清晰，所以我们约定，把所有的 HTML 文件都放到 views（视图） 目录中

#### 2 处理网站中的静态资源
我们为了方便的统一处理这些静态资源，所以约定把所有的静态资源都存放在 public 目录中
哪些资源能被用户访问，哪些资源不能被用户访问，我现在可以通过代码来进行非常灵活的控制
/public 整个 public 目录中的资源都允许被访问

#### 3 走通页面跳转加入404处理
不要再想文件路径了，把所有的路径都想象成 url 地址
+ 1.优化url：url中不写文件名
```javascript
if (url === '/') {
            fs.readFile('./views/index.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        } else if (url === '/post') {
            fs.readFile('./views/post.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        }
```
+ 2.404处理
访问不到的页面和资源则跳转到404页面
```javascript
fs.readFile('./views/404.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
```
#### 4 渲染评论首页
导入art-template,使用template将数据渲染到页面上
#### 5 处理表单get提交
url模块中的parse方法可以解析表单提交的数据
url.parse('请求路径',true)->把请求路径中的查询字符串给解析成一个对象
接下来要做的就是：
1. 获取表单提交的数据 parseObj.query
2. 将当前时间日期添加到数据对象中，然后存储到数组中
3. 让用户重定向跳转到首页 /
   当用户重新请求 / 的时候，我数组中的数据已经发生变化了，所以用户看到的页面也就变了
#### 6 表单提交重定向
通过服务器让客户端重定向
 1. 状态码设置为 302 临时重定
        statusCode
 2. 在响应头中通过 Location 告诉客户端往哪儿重定项
        setHeader
 如果客户端发现收到服务器的响应的状态码是 302 就会自动去响应头中找 Location ，然后对该地址发起新的请求
 所以你就能看到客户端自动跳转了
