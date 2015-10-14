var changeset = require('./changeset');
var history = require('./history');
var analize = require('./analize');
var config = require('./config');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');
var crontab = require('node-crontab');


var url = 'http://overpass-api.de/api/augmented_diff';

function init() {
	async.waterfall([
		function(callback) {
			changeset(url, callback);
		},

		function(json, callback) {
			console.log(JSON.stringify(json));
			callback();
		}
		// function(json, callback) {
		// 	analize(json, argv.idchangeset, callback)
		// }
	], function(err, result) {
		console.log("done")
	});
}


crontab.scheduleJob("*/1 * * * *", function() { //This will call this function every 2 minutes 
	console.log("================================================")
	init();
});