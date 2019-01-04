import io from 'socket.io-client';
const  socket = io('http://localhost:1337');

//all of the listeners and emitters for client go here

function joinGame(cb) {
    // socket.emit('join', player);
    socket.on('connectToRoom',(data)=> {
      cb(data)
    })
  }

function toggleData(cb){
  socket.on('connectToRoom',(data)=> {
    cb(data)
  })
}

function updateName(cb){
  socket.on('join', (p)=>{
    cb(p);
  }); 
}

  function updateBoard(board){
    socket.emit('board', board);
  }

  function retrieveBoard(cb){

    socket.on('board', (b)=>{
      cb(b);
    })
  }

  // function playerTrack(){
  //   socket.emit('update', socket.id)
  // }

  function toggle(array, room){
    // console.log('no socket?', socket.id)
    socket.emit('toggle', socket.id, array, room);
  }

  function player(cb){
    socket.on('toggle', (currentPlayer)=>{
      cb(currentPlayer)
    })
  }

  function updatePlayer(player){
    socket.emit('player', player)
  }

  function retrievePlayer(cb){
    socket.on('player', (p)=>{
      cb(p)
    })
  }

  function lobby(room, player){
    socket.emit('lobby', room, player)
  }

  function lobbyCheck(cb){
    socket.on('lobby', (bool)=>{
      cb(bool)
    })
  }

export { joinGame, toggleData, lobby, lobbyCheck, toggle, player, updateName, updateBoard, retrieveBoard, updatePlayer, retrievePlayer};