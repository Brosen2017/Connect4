import io from 'socket.io-client';
const  socket = io('http://localhost:1337');

//all of the listeners and emitters for client go here

function joinGame(player, cb) {

    //socket emit sends data
    socket.emit('join', player);

    //socket on listens
    socket.on('join', (p)=>{
      // if(p === "taken"){
      //  alert('username already taken')
      // } else {
      // return console.log('user connected', p) 
      // }
      cb(p);
    });
    
  }

  function playPiece(piece, cb){

    socket.emit('place', piece);

    socket.on('place', (spot)=>{
    cb(spot)
    // return JSON.stringify(c)
    })
  }

  function updateBoard(board){

    socket.emit('board', board);

    // socket.on('board', (b)=>{
    //   cb(b);
    // })

  }

  function retrieveBoard(cb){

    socket.on('board', (b)=>{
      cb(b);
    })
  }

export { joinGame, playPiece, updateBoard, retrieveBoard };