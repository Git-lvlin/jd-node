var express=require('express')
var router=express.Router()
var goodsModel=require('../model/good/goodsModel')
var cateModel=require('../model/good/cateModel')
var adveMOdel=require('../model/good/adveMOdel')



// 获取商品列表
//get url:/good/list
//入参：{ name,min_price,max_price,page,size,cate_zh,stutas }
router.get('/list',function(req,res){
    var {name,min_price,max_price,page,size,cate_zh,stutas,img,cate,hot,star,desc}=req.query

    //非必填
    page=parseInt(page||1)
    size=parseInt(size||10)
    name=name||''
    cate_zh=cate_zh||''
    img=img||''
    desc=desc||''
    cate=cate||''
    // rank=rank||10
    hot=hot||false
    star=star||1
    // shopId=shopId||''
    stutas=stutas||1
    min_price=Number(min_price||0)
    max_price=Number(max_price||Infinity)

    // 多条件查询
    var params={
        name:new RegExp(name),
        // img,
        // desc,
        cate,//根据不同的品类来输出对应的商品
        // hot,
        // shopId,
        // stutas,
        // cate_zh,
       
        price:{$gte:min_price,$lte:max_price},
    }
    // if(!hot) delete params.hot//不传就删除
    if(!cate) delete params.cate

    // // 排序
    var sort={
        star,//商品排名排序
        create_time: -1//时间排序
    }
    // if(!rank) delete sort.rank//不传就删除
    if(!star) delete sort.star

    goodsModel.find(params,{name:1,price:1,cate_zh,stutas,img:1,cate:1,hot:1,star:1,desc:1,create_time:1})//自定义返回需要的内容
    .limit(size)
    .sort(sort)//排序
    .skip((page-1)*size)
    .then(list=>{
        // console.log(list)
        res.json({err:0,msg:'success',data:{list,total:list.length}})//total用来给前端判断有多少条数据
    })
    
})

//根据id获取商品详情信息
//get url:/good/detail
//入参：{_id} 
router.get('/detail',function(req,res){
    let {id}=req.query//_id
    if(!id){
        res.json({err:-1,msg:'没有传入id'})
    }
    goodsModel.findById(id).then(ele=>{
        res.json({err:0,msg:'success',data:ele})
    })
})


//获取商品品类
//get url:/good/cates
router.get('/cates',function(req,res){
    cateModel.find().then((ele)=>{
        res.json({err:0,msg:'success',data:ele})
    })
})

//删除商品
//post url:/good/del
//入参：{ ids }
router.post('/del',function(req,res){
    // console.log('ids',req.body)
    var { ids }=req.body
    console.log('ids',ids)

    var idArr=ids.split(';').filter(ele=>ele)//筛选出有值的id
    var conunt=0
    idArr.map(item=>{
        goodsModel.deleteOne({_id:item}).then(()=>{
            conunt++
            if(conunt==idArr.length){//相等表示删除所有选中的商品
            res.json({err:0,msg:'success'}) 
            }
        })
    })
    
})

//新增商品
//post url:/good/add
//入参：{ id,name,page,size,cate_zh,stutas,img,cate,hot,star,desc,create_time }
router.post('/add',function(req,res){
    var { id,name,page,size,cate_zh,stutas,img,cate,hot,star,desc,create_time }=req.body
    var ele={
        page:1,
        size:5,
        name,
        cate,
        create_time,
        img,
        price:1,
        star,
        hot,
        desc
    }
    if(id){//编辑
        goodsModel.updateOne({_id:id},{$set:ele}).then(()=>{
            res.json({err:0, msg:'修改成功'})
        })
    }else{//新增
        goodsModel.insertMany(ele).then(()=>{
            res.json({err:0, msg:'新增成功'})
        })
    }
   
})


//新增轮播图
//post url:/good/addr
//入参：{ id,name,page,size,img,create_time }
router.post('/addr',function(req,res){
    var { name,page,size,img,create_time ,link}=req.body
    var ele={
        page:1,
        size:5,
        name,
        create_time,
        img,
        link
    }
     //新增
     adveMOdel.insertMany(ele).then(()=>{
        res.json({err:0, msg:'新增成功'})
    })
   
})


// 获取轮播图片
//get url:/good/list2
//入参：{ name,page,size,link }
router.get('/list2',function(req,res){
    var {page,size,name,img,link}=req.query

    //非必填
    page=parseInt(page||1)
    size=parseInt(size||10)
    name=name||''
    img=img||''
    link=link||''

    // 多条件查询
    var params={
        name:new RegExp(name),
    }

    adveMOdel.find(params,{name:1,img:1,link:1,create_time:1})//自定义返回需要的内容
    .limit(size)
    .skip((page-1)*size)
    .then(list=>{
        // console.log(list)
        res.json({err:0,msg:'success',data:{list,total:list.length}})//total用来给前端判断有多少条数据
    })
    
})

module.exports = router;