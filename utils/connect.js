const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/base', {//连接数据库
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