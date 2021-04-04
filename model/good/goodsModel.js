const mongoose=require('mongoose')

module.exports=mongoose.model('goods',new mongoose.Schema({//商品列表
    name:String,
    img:String,
    price: Number,
    desc:String,
    cate:String,
    rank:Number,
    hot:Boolean,
    star:Number,
    shopId:String,
    create_time:{ type: Number, default: Date.now() },
    stutas: Number
}))