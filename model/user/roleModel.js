const mongoose=require('mongoose')

module.exports=mongoose.model('roles',new mongoose.Schema({
    role:String,
    roleName:String,
    status:Number
}))