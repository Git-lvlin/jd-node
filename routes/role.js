var express=require('express')
var router=express.Router()
var userModel=require('../model/user/userModel')//用户信息
var roleModel=require('../model/user/roleModel')//角色信息

//添加用户信息
//入参：{ username, role }
router.post('/userAdd',function(req,res){
    var { username, role }=req.body
    var ele={
        username,
        role,
        password:123456
    }
    roleModel.findOne({role}).then(rel=>{//查询选择的角色来添加用户
        ele.role_name=rel.roleName
        userModel.insertMany([ele]).then(doc=>{
            res.json({ err:0, msg:'添加成功', data:{ info:doc } })
        })
    })
    
})


//获取用户信息
router.get('/userList',function(req,res){
    //$exists匹配包含该字段的文档
    userModel.find({role:{$exists:true}}).then(list=>{
        res.json({ err:0, msg:'success', data:{ list } })
    })
})


//获取角色信息
router.get('/adminList',function(req,res){
    roleModel.find().then(list=>{
        res.json({ err:0, msg:'success', data:{ list } })
    })
})

module.exports=router