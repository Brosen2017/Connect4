const express = require('express');
const parser = require('body-parser');
const http = require('http');
const path = require('path');
const Axios = require('axios');
const socket = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socket(server);
//const db = require('../database/index.js')


const PORT = 5000;

app.use(parser.json())
app.use(parser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '/../client/dist')));

app.get('/player', (req,res)=>{
    console.log('in get')
})

app.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})