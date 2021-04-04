# Node.js的三大特点

（1）基于Chrome V8的运行时环境。

（2）事件驱动（循环）：
	a、文件读写
	b、数据库操作
	c、调用另一台服务

（3)非阻塞I/O:
	input
	output
	阻塞vs.非阻塞

# 各种文件目录的作用
## bin目录下的www
* 引入http协议请求
* 对服务器端口进行修改
```
var port = normalizePort(process.env.PORT || '4444');
app.set('port', port);

```

## model
* 使用mongoose连接数据库、操作users集合
* Mongoose为模型提供了一种直接的，基于scheme结构去定义你的数据模型

```
const mongoose=require('mongoose')

module.exports=mongoose.model('表名',new mongoose.Schema({
    username:String,
    password:String,
    create_time:{ type: Number, default: Date.now() }
}))

```
## public（静态资源）
* 存放服务器图片、js脚本，favicon的地方

## routes
* 用来存放各种接口请求
```
var express = require('express');//基于 Node.js的Web 开发框架
var router = express.Router();

//各种请求接口
router.get('/',(req,res)=>{

})

router.post('/',(req,res)=>{
    
})

module.exports=router;

```

## utils工具库
* 一般用来放连接数据库的js、token生成解析.js
```
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/数据库名称', {//连接数据库
  useNewUrlParser: true,//这两个一定要加
  useUnifiedTopology: true
})
const db=mongoose.connection

db.once('open',function(){
    console.log('数据库连接成功')
})
db.on('error',function(){
    console.log('数据库连接失败')
})
```

## views
* 一般是放模板引擎的地方，mvc模式渲染的地方

## app.js（响应所有中间件的集合）
* 引入各种中间件
* 引入各种路由请求
* require('./utils/connect')//导入连接数据库

## Express

* Express与Koa简介
* Express搭建服务器、实现静态资源服务、动态资源服务
* Express路由的使用、使用中间件
* Express官网和api阅读、源码简单阅读

## mongodb数据库操作

* MongoDB，是NoSQL数据库，非关系型数据库、没有SQL的数据库。
* 数据库操作有三种方式：
	(1)通过命令行工具操作
	(2)通过可视化工具来操作
	(3)通过驱动模块来操作：mongodb / mongoose
* 使用mongoose连接数据库、操作users集合




# 知识点记忆
## 服务器请求响应
* 当node运行时，只会创建一台server。
* 每当有客户端访问时，回调函数都会运行一次。
* request是请求体对象，代表是客户端向服务端的请求过程
* response是响应体对象，代表是服务端向客户端的响应过程



## 删除购物车列表
* 实际上是把数据库里status的状态改为-1，不是真的删除


