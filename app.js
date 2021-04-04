var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');//静态资源路由请求
var usersRouter = require('./routes/users');//用户信息路由请求
var goodsRouter = require('./routes/goods');//商品列表路由请求
var cartRouter = require('./routes/cart');//商品列表路由请求



require('./utils/connect')//导入连接数据库
require('./utils/socketio')//连接socket服务


var app = express();

// 设置模板引擎,支持MVC
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app是响应所有中间件的集合

app.use(logger('dev'));//设置日志
app.use(express.json());//json格式的转化

// encodeURI / decodeURI 对编码的中文数据进行解码   get和post都是采用x-www-from-urlencoded编码格式
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//cookie解析

//静态资源服务   访问index.html
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))//favicon


//动态资源服务
const v = '/api/v1'//统一在url加入，以后要用到代理
app.use('/', indexRouter);
app.use(`${v}/user`, usersRouter);//要访问的路由地址
app.use(`${v}/good`, goodsRouter);//要访问的路由地址
app.use(`${v}/cart`, cartRouter);//购物车访问的路由地址
app.use(`${v}/upload`, require('./routes/upload'))//上传图片的中间件
app.use(`${v}/role`, require('./routes/role'))//用作用户权限中间件


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
