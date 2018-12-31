const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gameDB', {
    useMongoClient: true,
});

const db = mongoose.connection;

db.on('error', ()=> console.log('error connecting'))
db.once('open', ()=>{
    console.log('successfully connected to GameDB!')
});

let PlayerBase = mongoose.Schema({
Username: String,
Wins: Number   
})

let Player = mongoose.model('Player', PlayerBase);

module.exports.Player = Player;