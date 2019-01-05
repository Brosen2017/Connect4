const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);
const db = require('../database/index.js')
let store = [];
let bucket = [];
let rooms = [1,2,3,4,5,6,7,8,9,10]

const PORT = 1337;


var roomno = 1;
io.on('connection', (socket)=>{
    if(store.length < 2){
    store.push(socket.id)
    }


    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   socket.join("room-"+roomno);


   io.sockets.in("room-"+roomno).emit('connectToRoom', {player: store, room: +roomno});
   if(store.length === 2){
    bucket.push(store)
    store = []
    }
    
  

    // socket.broadcast.emit('user connected');
    //console.log('user connected', socket.id, bucket);
    //all listeners and emitters will be inside of the connection

    // socket.on('join',(player)=>{
    //     db.Player.find({
    //         Username: player 
    // }, (err, data)=>{
    //     if(err){
    //         throw(err)
    //     } else {
    //         // console.log('db data', data)
    //         if(data.length <= 0){
    //             io.emit('join', "taken")
    //         } else {
    //             io.emit('join', player)
    //         }
    //     }
    // })
    // })

    //now that lobby has been refactored to load dynamically based on room, must refactor other 
    //socket code to attribute on a per room basis

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


    socket.on('toggle',(currentPlayer, array, room)=>{
        //check if user at store[0] and he will return toggle 2
        //check if user at store[1] and he will return toggle 1
        //console.log('current player in toggle', currentPlayer, room, array)
        for(var i=0; i < bucket.length; i++){
            if(JSON.stringify(bucket[i]) === JSON.stringify(array) && room === rooms[room-1]){
                if(currentPlayer === bucket[i][0]){
                //if(currentPlayer === store[0]){
                    console.log('player 1', currentPlayer)
                socket.broadcast.in("room-"+rooms[room-1]).emit('toggle', 2)
                }
                if(currentPlayer === bucket[i][1]){
                //if(currentPlayer === store[1]){
                    console.log('player 2', currentPlayer)
                    socket.broadcast.in("room-"+rooms[room-1]).emit('toggle', 1)
                }
    }
}
    })


    socket.on('board', (board, room)=>{
        io.in("room-"+room).emit('board', board)
    })

    socket.on('player', (player, room)=>{
        
        console.log('here is the current player:', player)
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

    socket.on('disconnect', function(){
        console.log('user disconnected', socket.id);
        for(var i = 0; i < bucket.length; i++){
            for(x =0; x < bucket[i].length; x++){
                if(bucket[i][x] === socket.id){
                    console.log('disconnect in room', i + 1)
                    io.in("room-"+(i+1)).emit('disconnect', true)
                }
            }
        }
        //incorporate logic to implemement win or loss if someone disconnects
        //if user disconnects return other player to loading screen
        //if another user connects, push them into the room with an open space
      });
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})