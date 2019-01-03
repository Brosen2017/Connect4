import io from 'socket.io-client';
const  socket = io('http://localhost:1337');

//all of the listeners and emitters for client go here

function joinGame(player) {
    socket.emit('join', player);
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


  function toggle(){
    console.log('no socket?', socket.id)
    socket.emit('toggle', socket.id);
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

export { joinGame, toggle, player, updateName, updateBoard, retrieveBoard, updatePlayer, retrievePlayer};