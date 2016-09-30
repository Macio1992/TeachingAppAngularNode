'use strict';

let express = require('express');
let app = express();
let User = require('../models/user');

let auth = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/login');
    }
    else 
        next();
};

app.get('/', (req, res) => {
    User.find((err, users)=> {
        if(err){
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

app.get('/:user_id', (req, res)=>{
    User.findById(req.params.user_id, (err, user) => {
        if(err){
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

app.put('/:user_id', (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if(err) {
            res.send(err);
        } else {
            user.username = req.body.username;
            user.password = req.body.password;
            user.email = req.body.email;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.type = '';
            user.save((err) => {
                if(err){
                    res.send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
});

app.delete('/:user_id', (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        user.remove((err, users) => {
            if(err){
                res.send(err);
            } else {
                User.find((err, users)=>{
                    if(err){
                        res.send(err);
                    } else {
                        res.json(users);
                    }
                });
            }
        });
    });
});

app.get('/checkifexists/:name', (req, res)=>{
    User.findOne({ 'username': req.params.name}, (err, user) => {
        if(err){
            res.send(err);
        } else if(user){
            res.json({success: true, msg: 'Found user with given name'});
        } else if (!user) {
            res.json({success: false, msg: 'Not found user with given name'});
        }
    });
});

module.exports = app;