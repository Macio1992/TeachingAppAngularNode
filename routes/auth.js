"use strict";

let express = require('express');
var app = express();

let passport = require('passport');
let localStrategy = require('passport-local').Strategy;

let User = require('../models/user');

passport.use(new localStrategy(
    (username, password, done) => {
        User.findOne({ username: username, password: password }, (err, user) =>{
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, { message: 'Incorrect username.'});
            }
            if(user.password !== password){
                return done(null, false, { message: 'Incorrect password'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

let auth = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    else 
        next();
};

app.get('/', (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.render('index', {
            user: req.user
        });
    }
});

app.get('/loggedin', (req, res) => {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/login', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {
        user: req.user
    });
});

app.post('/register', (req, res) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.type = '';
    
    user.save((err)=>{
        if(err){
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = app;