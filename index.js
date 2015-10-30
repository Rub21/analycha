var status = require('./server/status');
var changeset = require('./server/changeset');
var team = require('./server/team');
var history = require('./server/history');
var analize = require('./server/analize');
var config = require('./server/config');
var db = require('./server/db');
var async = require('async');
var crontab = require('node-crontab');
var express = require("express");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));

socket.on('connection', function(socket) {
	console.log('socket.io connected');
});
server.listen(3000, function() {
	console.log("Started on PORT 3000");
});

//GET CHNGES FILES

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
			socket.emit("newchangest", users);
			db.InsertUsers(users);
			//db.listUsers();
			callback(null, users);
		}
	], function(err, users, result) {
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