import io from 'socket.io-client';
const  socket = io('http://localhost:1337');

//all of the listeners and emitters for client go here

function subscribeToTimer(player) {
    console.log('user connected', player)
    //socket on listens
    socket.on('join', ()=>{
        
    });
    //socket emit sends data
    socket.emit('join', player);
  }

  function placePiece(piece){

  }

export { subscribeToTimer };