const mongoose=require('mongoose')

module.exports=mongoose.model('adves',new mongoose.Schema({//轮播图列表
    name:String,
    img:String,
    create_time:{ type: Number, default: Date.now() },
    link:String
}))