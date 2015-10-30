var status = require('./status');
var changeset = require('./changeset');
var team = require('./team');
var history = require('./history');
var analize = require('./analize');
var config = require('./config');
var db = require('./db');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');
var crontab = require('node-crontab');
var express = require("express");

var path = require('path');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public');
});

app.get('/', function(req, res) {
	console.log(req.body);
});

socket.on('connection', function(socket) {
	console.log('socket.io connected');
});
server.listen(3000, function() {
	console.log("Started on PORT 3000");
})



function init() {
	async.waterfall([
		function(callback) {
			status(callback);
		},
		function(id, callback) {
			changeset(id, callback);
		},
		function(id, json, callback) {
			if (json !== null) {
				team(id, json, callback);
			} else {
				callback(null, []);
			}
		},
		function(users, callback) {
			console.log(users);
			db.InsertUsers(users);
			db.listUsers();
			callback();
		}
		// function(json, callback) {
		// 	analize(json, argv.idchangeset, callback)
		// }
	], function(err, result) {
		if (err) {
			console.log(err);
		}
		console.log("done")
	});
}

init();
crontab.scheduleJob("*/1 * * * *", function() { //This will call this function every 1 minutes 
	console.log("================================================")
	init();
});