const db = require('../database/index.js')

exports.get = (req,res)=>{
    console.log('in get')
}

exports.patch = (req,res)=>{
    console.log('player wins', req.body.user.wins)
    db.Player.findOne({
       Username: req.body.user.name 
    }, (err, data)=>{
        if(err){
            console.log(err)
        } else {
            if(!data.Username){
                // console.log('not new')
                new db.Player({
                    Username: req.body.user.name,
                    Wins: req.body.user.wins 
                }).save((err, data)=>{
                    if(err){
                        console.log(err)
                    } else {
                        res.status(200).send(data)
                    }
                })
            } else if(data.Username === req.body.user.name){
                // console.log('in update')
                db.Player.update(
                    {Username: req.body.user.name}, 
                    {$set:{Wins: req.body.user.wins}},(err,data)=>{
                        if(err){
                            throw(err)
                        } else {
                            res.status(201).send(data)
                            console.log('updated')
                        }
                    })
                } 
            }
        })
}

