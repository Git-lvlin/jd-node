const jwt=require('jsonwebtoken')
//生成token
function createToken(data){
    return jwt.sign({
          data,
          iat: Math.floor(Date.now() / 1000) - 30 },
           'vip'//暗号
           )
}

//验证token
function verifyToken(req,res){
    return new Promise((resolve,reject)=>{
        const token=req.headers.authorization//接收token
        try{
            var decode=jwt.verify(token, 'vip')//暗号
            resolve(decode.data)
            
            //   decode {
            //     data: {
            //       username: 'sdfds546',
            //       password: 'fdgd3453',
            //       _id: '6052ba5f1eb6e22520b6facf'
            //     },
            //     iat: 1616067422
            //   }
              
        }catch(err){
            res.json({err:-1,msg:'token错误'})
        }
    })
}

module.exports={
    createToken,
    verifyToken
}