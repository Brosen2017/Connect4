const express = require('express');
const parser = require('body-parser');
const path = require('path');
const router = require("./router.js");
const app = express();

const PORT = 5000;

app.use(parser.json())
app.use(parser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '/../client/dist')));

app.use("/", router);


app.listen(PORT, function(){
    console.log(`successfully listening on ${PORT}!`)
})