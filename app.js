var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodeFetch = require('node-fetch');
require('dotenv').config();

var users = require('./routes/users');
var videos = require('./routes/videos');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/videos', videos);

module.exports = app;
