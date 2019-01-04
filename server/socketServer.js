const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);
const db = require('../database/index.js')
let currPlayer = null;
let store = [];
let bucket = [];

const PORT = 1337;

//all the server side listeners and emitters go here
 var roomno = 1;
io.on('connection', (socket)=>{
    // for(var i = 0; i < store.length; i++){

    // }
    if(store.length < 2){
    store.push(socket.id)
    }
    // if(store.length === 2){
    // bucket.push(store)
    // store = []
    // }

    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   socket.join("room-"+roomno);


   io.sockets.in("room-"+roomno).emit('connectToRoom', {player: store, room: +roomno});
   if(store.length === 2){
    bucket.push(store)
    store = []
    }
    
    //store.push(socket.id)
  

    // socket.broadcast.emit('user connected');
    console.log('user connected', socket.id, bucket);
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
            //if(store.length >= 2){
            // if(roomno === 2){
            // io.in("room-"+roomno).emit('lobby', false)
            // } else {
            //io.emit('lobby', true)
            //}else{
            //io.emit('lobby', false)
            //}
            io.in("room-"+room).emit('lobby', true)

        } else {
            io.in("room-"+room).emit('lobby', false)
        }
    }
    }
    })

    socket.on('update',(currentPlayer)=>{
        currPlayer = currentPlayer
        console.log('player in update', currPlayer)
    })

    socket.on('toggle',(currentPlayer, array, room)=>{
        //check if user at store[0] and he will return toggle 2
        //check if user at store[1] and he will return toggle 1
        console.log('current player in toggle', currentPlayer, room, array)
        for(var i=0; i < bucket.length; i++){
            if(JSON.stringify(bucket[i]) === JSON.stringify(array) && room === roomno){
        //implement logic to compare bucket[0][0]
                if(currentPlayer === bucket[i][0]){
                //if(currentPlayer === store[0]){
                    console.log('player 1', currentPlayer)
                socket.broadcast.in("room-"+room).emit('toggle', 2)
                }
                //implement logic to compare bucket[0][1]
                if(currentPlayer === bucket[i][1]){
                //if(currentPlayer === store[1]){
                    console.log('player 2', currentPlayer)
                    socket.broadcast.in("room-"+room).emit('toggle', 1)
                }
    }
}
    })

    socket.on('place',(piece)=>{
        console.log('piece placed at index:', piece)
        io.emit('place', piece)
    })

    socket.on('board', (board)=>{
        // console.log('here is the new board:', board)
        io.emit('board', board)
    })

    socket.on('player', (player)=>{
        console.log('here is the current player:', player)
        if(player === 1){
            io.emit('player', 'Red wins!')   
        }
        if(player === 2){
            io.emit('player', 'Blue wins!')
        }
        if(player === null){
            io.emit('player', 'Draw!')
        }
    })

    socket.on('disconnect', function(){
        //store.pop();
        console.log('user disconnected');
      });
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})