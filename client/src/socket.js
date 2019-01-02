import io from 'socket.io-client';
const  socket = io('http://localhost:1337');

//all of the listeners and emitters for client go here

function joinGame(player) {

    //socket emit sends data
    socket.emit('join', player);

    //socket on listens
    socket.on('join', (p)=>{
      if(p === "taken"){
       alert('username already taken')
      } else {
      return console.log('user connected', p) 
      }
    });
    
  }

  function playPiece(piece, player){

    socket.emit('place', piece);

    socket.on('place', (c)=>{
    return console.log(`Player ${player} played at `, c)
    // return JSON.stringify(c)
    })
  }

  function updateBoard(board){
    let result =[];
    socket.emit('board', board);

    socket.on('board', (b)=>{
      return result.push(b);
    })
    return result;
  }

export { joinGame, playPiece, updateBoard };