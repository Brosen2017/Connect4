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
    // db.Player.find({
    //    Username: req.body.user.name 
    // }, (err, data)=>{
    //     if(err){
    //         throw(err)
    //     } else if(!data[0].Username){
    //              console.log('new', data)
    //             new db.Player({
    //                 Username: req.body.user.name,
    //                 Wins: req.body.user.wins 
    //             }).save((err, data)=>{
    //                 if(err){
    //                     throw(err)
    //                 } else {
    //                     res.status(200).send(data)
    //                 }
    //             })
    //         } else if(data.Username === req.body.user.name){
    //              console.log('in update')
    //             db.Player.update(
    //                 {Username: req.body.user.name}, 
    //                 {$set:{Wins: req.body.user.wins}},(err,data)=>{
    //                     if(err){
    //                         throw(err)
    //                     } else {
    //                         res.status(201).send(data)
    //                         console.log('updated')
    //                     }
    //                 })
    //             } 
    //         })



