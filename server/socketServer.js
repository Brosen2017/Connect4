const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);

const PORT = 1337;

//all the server side listeners and emitters go here

io.on('connection', (socket)=>{
    console.log('user connected', socket.id);
    //all listeners and emitters will be inside of the connection
    socket.on('join',(player)=>{
        console.log('player connected', player)
    })
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})