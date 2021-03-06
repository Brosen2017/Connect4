import io from "socket.io-client";
const socket = io("http://localhost:1337");

//all of the listeners and emitters for client happen here

function joinGame(cb) {
  socket.on("connectToRoom", data => {
    cb(data);
  });
}

function toggleData(cb) {
  socket.on("connectToRoom", data => {
    cb(data);
  });
}

function updateName(cb) {
  socket.on("join", p => {
    cb(p);
  });
}

function updateBoard(board, room) {
  socket.emit("board", board, room);
}

function retrieveBoard(cb) {
  socket.on("board", b => {
    cb(b);
  });
}

function toggle(array, room) {
  socket.emit("toggle", socket.id, array, room);
}

function player(cb) {
  socket.on("toggle", currentPlayer => {
    cb(currentPlayer);
  });
}

function updatePlayer(player, room) {
  socket.emit("player", player, room);
}

function retrievePlayer(cb) {
  socket.on("player", p => {
    cb(p);
  });
}

function lobby(room, player) {
  socket.emit("lobby", room, player);
}

function lobbyCheck(cb) {
  socket.on("lobby", bool => {
    cb(bool);
  });
}

function disconnect(cb) {
  socket.on("disconnect", bool => {
    cb(bool);
  });
}

export {
  joinGame,
  disconnect,
  toggleData,
  lobby,
  lobbyCheck,
  toggle,
  player,
  updateName,
  updateBoard,
  retrieveBoard,
  updatePlayer,
  retrievePlayer
};
