const db = require('../database/index.js')

exports.get = (req,res)=>{
    console.log('in get')
    db.Player.find({},(err,data)=>{
        if(err){
            throw(err)
        } else{
            res.status(200).send(data)
        }
    })
}

exports.patch = (req,res)=>{
    console.log('player', req.body.user.name)
    db.Player.update(
        {Username: req.body.user.name}, 
        {Wins: req.body.user.wins},{ upsert: true },(err,data)=>{
        if(err){
            throw(err)
        } else {
            res.status(200).send(data)
            console.log('updated')
        }
    })
} 




