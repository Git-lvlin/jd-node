const mongoose=require('mongoose')

module.exports=mongoose.model('goods',new mongoose.Schema({//ๅๅๅ่กจ
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