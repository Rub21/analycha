var request = require('./req');
var count = require('./count');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');

var url = 'https://www.openstreetmap.org/api/0.6/changeset/' + argv.id + '/download';

async.waterfall([
	function(callback) {
		request(url, callback);
	},
	function(json, callback) {
		count(json, callback);
	},
	function(json, callback) {
		console.log(JSON.stringify(json));
		callback();
	}
], function(err, result) {
	console.log("done")
});