const mongoose=require('mongoose')

module.exports=mongoose.model('carts',new mongoose.Schema({
    num:Number,//商品数量
    cart_id:String,//商品id
    create_time:{type:Number,default:Date.now()},
    user_id:String,//用户信息id，用来判断是否登录
    status:{type:Number,default:1}//购物车里商品的状态
}))