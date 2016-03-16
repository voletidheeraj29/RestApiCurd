var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./rest');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));

app.use('/', route);

module.exports = app;
