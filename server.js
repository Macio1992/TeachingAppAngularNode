'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let passport = require('passport');

let mongoose = require('mongoose');
let path = require('path');
let expressSession = require('express-session');
let cookieParser = require('cookie-parser');

let port = process.env.PORT || 3000;
let url = 'mongodb://mongouser:mongopassword@ds041992.mongolab.com:41992/appdb';

let auth = require('./routes/auth');
let users = require('./routes/users');

mongoose.connect(url);
mongoose.connection.on('open', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', () => {
    console.log('Not connected to MongoDB');
});

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(expressSession({
    secret: 'securredSession',
    resave: false,
    saveUninitialized: false

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', auth);
app.use('/users', users);

app.listen(port, () => {
    console.log('localhost:' + port);
});