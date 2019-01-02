const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);

const PORT = 1337;

//all the server side listeners and emitters go here

io.on('connection', (socket)=>{

    socket.broadcast.emit('user connected');
    console.log('user connected', socket.id);
    //all listeners and emitters will be inside of the connection
    socket.on('join',(player)=>{
        console.log('player connected', player)
        if(player === "bob"){
            io.emit('join', "taken")
        } else {
            io.emit('join', player)
        }
    
    })

    socket.on('place',(piece)=>{
        console.log('piece placed at index:', piece)
        io.emit('place', piece)
    })

    socket.on('board', (board)=>{
        console.log('here is the new board:', board)
        io.emit('board', board)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})