const mongoose=require('mongoose')

module.exports=mongoose.model('orders',new mongoose.Schema({//用户订单列表
    order_no:String,//订单编号
    create_time:{type:Number,default:Date.now()},//订单生成时间
    user_id:String,
    statusL:{ type: Number, default: 1 },//商品状态
    package:String,//所有要提交的商品id
    addr_id:String
}))