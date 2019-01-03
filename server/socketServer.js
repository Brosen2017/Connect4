const app = require('express')();
const http = require('http').Server(app)
var io = require('socket.io')(http);
const db = require('../database/index.js')
let store = [];

const PORT = 1337;

//all the server side listeners and emitters go here

io.on('connection', (socket)=>{
    
    store.push(socket.id)

    // socket.broadcast.emit('user connected');
    console.log('user connected', socket.id);
    //all listeners and emitters will be inside of the connection

    socket.on('join',(player)=>{
        db.Player.find({
            Username: player 
    }, (err, data)=>{
        if(err){
            throw(err)
        } else {
            // console.log('db data', data)
            if(data.length <= 0){
                io.emit('join', "taken")
            } else {
                io.emit('join', player)
            }
        }
    })
    })

    socket.on('toggle',(currentPlayer)=>{
        //check if user at store[0] and he will return toggle 2
        //check if user at store[1] and he will return toggle 1
        console.log('current player in toggle', currentPlayer, store[0])
        if(currentPlayer === store[0]){
            console.log('player 1', currentPlayer)
        socket.broadcast.emit('toggle', 2)
        }
        if(currentPlayer === store[1]){
            console.log('player 2', currentPlayer)
            socket.broadcast.emit('toggle', 1)
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
        console.log('user disconnected');
      });
})

http.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})