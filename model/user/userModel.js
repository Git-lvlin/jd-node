const mongoose=require('mongoose')

module.exports=mongoose.model('users',new mongoose.Schema({//用户信息列表
    username:String,
    password:String,
    create_time: Number,
    email: String,
    mobile: String,
    role: String,
    avatar: String,
    nick_name: String,
    role_name: String,
    status: { type: String, default: 1 }
}))