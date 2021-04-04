const mongoose=require('mongoose')

module.exports=mongoose.model('cates',new mongoose.Schema({
    cate:String,
    cate_zh:String
}))