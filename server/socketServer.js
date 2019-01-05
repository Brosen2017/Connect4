const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);
//const db = require('../database/index.js')
const PORT = 1337;
let store = [];
let bucket = [];
let rooms = [1]




var roomno = 1;
io.on('connection', (socket)=>{
    
    if(rooms[roomno-1] !== roomno){
         rooms.push(roomno)
    }
    
    if(store.length < 2){
    store.push(socket.id)
    }

    //create a new room every time two players join into a room
    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   socket.join("room-"+roomno);

   //send the user room to the connected clients, push the toom into the room bucket and reset store array 
   io.sockets.in("room-"+roomno).emit('connectToRoom', {player: store, room: +roomno});
   if(store.length === 2){
    bucket.push(store)
    store = []
    }

    //verify user rooms are full on a per room basis, if true game will start, if not loading screen will open
    socket.on('lobby', (room, player)=>{
        console.log('client room!', player)
        for(var i=0; i < bucket.length; i++){
            if(JSON.stringify(bucket[i]) === JSON.stringify(player)){
                if(bucket[room -1].length >= 2){
                    io.in("room-"+room).emit('lobby', true)

                } else {
                io.in("room-"+room).emit('lobby', false)
                }
            }
        }
    })

    //verify the current room and room number, if they match check the current player and emit the next turn the other player connected in the room
    socket.on('toggle',(currentPlayer, array, room)=>{
        for(var i=0; i < bucket.length; i++){
            if(JSON.stringify(bucket[i]) === JSON.stringify(array) && room === rooms[room-1]){
                if(currentPlayer === bucket[i][0]){
                    //console.log('player 1', currentPlayer)
                socket.broadcast.in("room-"+rooms[room-1]).emit('toggle', 2)
                }
                if(currentPlayer === bucket[i][1]){
                    //console.log('player 2', currentPlayer)
                    socket.broadcast.in("room-"+rooms[room-1]).emit('toggle', 1)
                }
    }
}
    })

    //refresh the board based on the room its coming from
    socket.on('board', (board, room)=>{
        io.in("room-"+room).emit('board', board)
    })

    //this function is only called when a player wins or draws, and it emits the winning player to all connected in the room
    socket.on('player', (player, room)=>{

        //console.log('here is the current player:', player)
        if(player === 1){
            io.in("room-"+room).emit('player', 'Red wins!')   
        }
        if(player === 2){
            io.in("room-"+room).emit('player', 'Blue wins!')
        }
        if(player === null){
            io.in("room-"+room).emit('player', 'Draw!')
        }
    
    })

    //verify the room the user disconnected from, and let the other player in the room know that they can start a new match
    socket.on('disconnect', function(){
        console.log('user disconnected', socket.id);
        for(var i = 0; i < bucket.length; i++){
            for(x =0; x < bucket[i].length; x++){
                if(bucket[i][x] === socket.id){
                    console.log('disconnect in room', i + 1)
                    // bucket.splice(i,1,[]); //refactor needed to iron out bugs, works fine without it, but could save space this way
                    // console.log('current bucket', bucket)
                    io.in("room-"+(i+1)).emit('disconnect', true)
                }
            }
        }
      });
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})