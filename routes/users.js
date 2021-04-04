var express = require('express');
var router = express.Router();
var userModel=require('../model/user/userModel')//导入数据库的表进行增删改查操作
var jwt=require('../utils/jwt')
var addModel=require('../model/user/addModel')//地址编辑
var orderModel=require('../model/good/orderModel');//订单列表
var goodsModel=require('../model/good/goodsModel')//商品列表
// import Cookies from 'js-cookie'

// 描述：用于请求用户列表
// GET / user/list
//入参：{user,age}
//入参：{err:0,msg:'',data:{}}
// url: http://localhost:3000/api/v1/user/list
router.get('/list', function(req, res) {
  var {page,size,username}=req.query
  page=parseInt(page||1)
  size=parseInt(size||1)
  userModel.find({username:new RegExp(username)}).skip((page-1)*size).limit(size).then(list=>{//查询数据库全部内容
    res.json({err:0,msg:'sucees',data:list})//返回给前端的数据
  })
});

//用户注册
//post请求 url:/user/regist
//入参:{username,password}
//出参：{err:,msg:'',data:username}
router.post('/regist',function(req,res){
  var {username,password,password2}=req.body
  //必填项
  if(!username||!/^[a-zA-Z][a-zA-Z0-9\~\!\@]{3,10}$/.test(username)){//判断用户名有没有填，格式是不是以字母开头,包含数字，3~10位
    return res.json({err:-1,msg:'用户名不能为空或者格式不对'})
  }
  if(!password||!/^[a-zA-Z][a-zA-Z0-9\~\!\@]{3,10}$/.test(password)){//判断密码有没有填，格式是不是以字母开头,包含数字，3~10位
    return res.json({err:-1,msg:'密码不能为空或者格式不对'})
  }
  if(password!=password2||!password2){//判断再次输入的密码和之前的相不相同
    return res.json({err:-1,msg:'密码不一致'})
  }
  userModel.find({username}).then(ele=>{
    if(ele.length>0){//查询数据库是否有该账号
      return res.json({err:-1,msg:'该用户已被注册'})
    }else{
      var ele={
        username,
        password,
        password2,
        create_tiem:Date.now()
      }
      userModel.insertMany([ele]).then((item)=>{//数据库不存在该账号就插入
        res.json({err:0,msg:'注册成功',data:item})
      })
    }
  })
})



//用户登录
//post url:/user/login
//入参:{username,password}
//出参：{err:,msg:'',data:username}
router.post('/login',function(req,res){
  var {username,password}=req.body
  if(!username){
    return res.json({err:-1,msg:'username必填'})
  }
  userModel.find({username,password}).then(ele=>{
    if(ele.length==1){
      //登录成功生成token,要传入_id,不然加入不了购物车
      res.json({err:0,msg:'登录成功',data:{token:jwt.createToken({username,password,_id:ele[0]._id})}})
    }else{
      res.json({err:-1,msg:'还没有注册'})
    }
  })
})

//新增地址
//POST url:/user/addr/add
//入参：{ receiver, addr, mobile, primary }
router.post('/addr/add',function(req,res){
  let { receiver, addr, mobile, primary }=req.body
  jwt.verifyToken(req,res).then(user=>{
    primary=primary||false
    const data={
      receiver,
      addr,
      mobile,
      primary,
      user_id:user._id
    }
    if(primary){//如果选择为默认地址，就把其他的默认地址设置为false
      addModel.updateMany({user_id:user._id},{$set:{primary:false}}).then(()=>{
        addModel.insertMany([data]).then(()=>{
          res.json({ err:0, msg:'success'})
        })
     })
    }else{//没有选择默认地址，就不进行其他操作
      addModel.insertMany([data]).then(()=>{
        res.json({ err:0, msg:'success'})
      })
    }
})
})


//获取地址
//GET url:/user/addr/list
router.get('/addr/list',function(req,res){
  jwt.verifyToken(req,res).then(user=>{
    addModel.find({user_id: user._id}).then((list)=>{
      //获取到当前的所有地址列表
      res.json({ err:0, msg:'success', data:{list} })
    })
  })
})

//修改默认地址
//GET url:/addr/default
//入参：{ addr_id }
router.get('/addr/default',function(req,res){
  jwt.verifyToken(req,res).then(user=>{
    var { addr_id }=req.query
    //把当前用户的其他地址设置为false
    addModel.updateMany({user_id:user._id},{$set:{primary:false}}).then(()=>{
    // 把当前选中的地址设置为默认
      addModel.updateOne({_id:addr_id},{$set:{primary:true}}).then(()=>{
        res.json({ err:0, msg:'success'})
      })
    })
  })
})

//获取订单列表
//入参：{  }
router.get('/order',function(req,res){
  jwt.verifyToken(req,res).then(user=>{
    orderModel.find({user_id:user._id}).then(ele=>{
      var conunt=0
      // var obj={}//存储所有订单信息
      var arr=[]
      console.log('ele',ele)
      ele.map(item=>{
        goodsModel.find({_id:item.package}).then(doc=>{//返回商品信息
        conunt++
        arr.push(doc)
        var obj={
        orderArr:ele,//订单信息
        arr//商品数组
       }
      //  obj.push(doc)
        if(ele.length==conunt){
            res.json({ err:0, msg:'success', data:obj })
        }
      })
      })      
    })
  })
})

//用于请求用户列表
router.get('/info',function(req,res){
  jwt.verifyToken(req,res).then(user=>{
    userModel.findOne({ _id:user._id }).then(doc=>{
      var token={
        roles: [doc.role],
        introduction: doc.role_name,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: doc.username
      }
      console.log(token)
      res.json({err:0,msg:'sueccess',token, data:token})
    })
 
})
})

//退出登录
//url: '/user/logout',
//type: 'post',
router.post('/logout',function(req,res){
  res.json({ err:0,msg:'success' })
})


module.exports = router;
