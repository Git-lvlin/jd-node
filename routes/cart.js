var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')
var cartModel = require('../model/good/cartModel')//购物列表
var goodsModel=require('../model/good/goodsModel')//商品列表
var addModel=require('../model/user/addModel')//地址列表
var orderModel=require('../model/good/orderModel')//订单列表

var socket=require('../utils/socketio')//导入socket



//加入购物车
// POST url:cart/add
// 入参：{good_id,num}
router.post('/add',function(req,res){
    var {good_id,num}=req.body
    if(!good_id){
        return res.json({err:-1,msg:'没传入id'})
    }
    //判断是否已登录，要是登录才能加入购物车
    jwt.verifyToken(req,res).then(ele=>{
        const data={//要添加的商品入参
            user_id:ele._id,//用户信息id
            num:parseInt(num||1),
            cart_id:good_id//商品id
        }
        const params={//用来判断数据库中是否存在该商品的入参
            user_id:ele._id,//用户信息id
            status:1,
            cart_id:data.cart_id//商品id
        }

        cartModel.find(params).then((docs=>{//查询数据库中是否存在该商品
            if(docs.length===1){//如果存在num就加上传入的num
                cartModel.updateMany(params,{ $set:{num:docs[0].num + data.num}  })
                .then(()=>{
                    res.json({err:0,msg:'num更新成功'})
                })
            }else{
                cartModel.insertMany(data).then(()=>{//插入
                    res.json({err:0,msg:'加入数据库成功'})
                })
            }
        }))

    })
})


//获取购物车商品和默认地址
//GET url:/cart/list
//入参:{ page,size }
router.get('/list',function(req,res){
    let {page,size}=req.query
    page=parseInt(page||1)
    size=parseInt(size||10)
    //判断用户
    jwt.verifyToken(req,res).then(user=>{
       var id=user._id//拿到用户信息id
       cartModel.find({}).then(box=>{
        var sum=0
        box.map(ele=>{//遍历购物车列表，如果所有商品状态为-1时就不执行下面的
            if(ele.status==-1){
                sum++
                if(sum==box.length){  
                    return   
                }
            }
        })
        cartModel.find({user_id:id,status:1}).then(list=>{//根据用户id拿到用户购物车信息
            if(list.length>0){
                let count=0
                const data=[]
                list.map(item=>{
                goodsModel.findById(item.cart_id).then(shop=>{//根据购物车id找到相匹配的商品id拿到商品列表
                    count++
                    data.push({//存储用户信息
                    _id: item._id,
                    num: item.num,
                    user_id: item.user_id,
                    good: shop
                    })
                    if(count==list.length){
                        addModel.find({user_id:user._id,primary:true}).then(docs=>{//获取地址栏的默认地址
                            res.json({ err:0,msg:'获取地址成功',data:{ list:data,addr:docs} })
                    })
                    }
                })

            })
            }
        })//获取为1的商品结束

    })//获取所有结束
    })
})

//删除购物车商品
//GET url:/cart/del
//入参：{ id } 商品_id 
router.get('/del',function(req,res){
    var { id }=req.query
    jwt.verifyToken(req,res).then(user=>{
        cartModel.updateOne({_id:id},{$set:{status:-1}}).//实际上是把数据库里status的状态改为-1，不是真的删除
        then(()=>{
            res.json({err:0,msg:'删除成功'})
        })
    })
})

//更新购物车数量变化
//POST url:/cart/update
//入参：{ id num }
router.post('/update',(req,res)=>{
    var { id , num }=req.body
    if(!num) return res.json({err:-1,msg:'没有传num'})
    num=parseInt(num)
    jwt.verifyToken(req,res).then(user=>{//鉴权
        cartModel.updateOne({_id:id},{$set:{num}}).then(()=>{//要用箭头函数,更新商品数量
            res.json({err:0,msg:'success'})
        })
    })
    
})

//购买，提交订单
//POST url:cart/submit
// 入参： { ids }  是购物车列表项_id组件成的字符串
router.post('/submit',(req,res)=>{
    jwt.verifyToken(req,res).then(user=>{
    const { ids }=req.body//前端传过来的勾选商品_id组成的字符串
        if(!ids) return res.json({err:-1,msg:'请选择要提交的商品'})
        const idsArr=ids.split(';').filter(ele=>ele)//过滤出存在的id
        let count=0
        idsArr.map(ele=>{
            //把要提交的商品status变为-1
            cartModel.updateOne({_id:ele},{$set:{status:-1}}).then(()=>{
               count++
                //表示所有选中的商品都已删除
               if(count===idsArr.length){
                //生成一个订单
                const oredr={
                    order_no:'JD'+Date.now(),//订单编号
                    user_id:user._id,
                    package:ele//所有要提交的商品id
                }
                //插入到订单列表
                orderModel.insertMany([oredr]).then(()=>{
                    // 发给3000这台socket服务器
                    socket.emit('data',oredr)
                    res.json({err:0,msg:'订单已提交生成',data:{oredr_no:oredr.order_no}})
                })
                
               }
                
            })
        })
    })
})





module.exports = router