'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index', {
        appToken: process.env.SMOOCH_APP_TOKEN
    });
});

module.exports = app;
