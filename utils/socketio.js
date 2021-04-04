var io=require('socket.io-client')

var socket=io('http://localhost:3000')//socket服务器地址

socket.on('connect',()=>{//监听连接
    console.log('我连接上socket了')
})

socket.on('server',msg=>{// server跟socket的io.emit发送的事件相对应
    console.log('我接收到socket发来的消息',msg)
})

socket.emit('data','你好，socket')
module.exports=socket