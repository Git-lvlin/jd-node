const mongoose=require('mongoose')

module.exports=mongoose.model('addrs',new mongoose.Schema({
    user_id:String,//用户id
    receiver:String,//地址
    addr:String,//地址
    mobile:String,//电话
    primary:Boolean//默认的
}))