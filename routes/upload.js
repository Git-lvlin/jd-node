var express=require('express');
var router=express.Router();
var fs=require('fs');
var path=require('path')

//用于处理非表单的文件数据流
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var cpUpload=upload.fields([{ name:'xxx',maxCount:1}])


//图片上传
//POST /upload/img
//入参 { xxx }

router.post('/img',cpUpload,(req,res)=>{
    
    const img=req.files.xxx[0]
    console.log(img);
    //接收后台服务器发过来的图片数据保存到临时空间
    // {
    //   fieldname: 'xxx',
    //   originalname: '1a431cbfc9.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: 'uploads/',
    //   filename: '5805d88ccc639b46b3d056e16134954a',
    //   path: 'uploads\\5805d88ccc639b46b3d056e16134954a',
    //   size: 202358
    // }

    //利用fs模块读到图片的path路径
    var readStream=fs.createReadStream(img.path)
    var imgPath=`/nds/${Date.now()}-${img.originalname}`
    //利用fs模块把临时空间中的图片写进服务器硬盘上
    var writeStream=fs.createWriteStream(path.resolve(__dirname,`../public${imgPath}`))

    //管道流
    readStream.pipe(writeStream)
    //监听管道流的关闭事件
    writeStream.on('close',()=>{
        res.json({err:0,msg:'success',data:{img:imgPath}})//返回给后台管理系统，再由后台管理提交到数据库
    })
})
module.exports=router;