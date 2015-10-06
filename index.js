var changeset = require('./changeset');
var history = require('./history');
var analize = require('./analize');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');
var url = 'https://www.openstreetmap.org/api/0.6/changeset/' + argv.id + '/download';
async.waterfall([
	function(callback) {
		changeset(url, callback);
	},
	function(json, callback) {
		history(json, callback);
	},
	function(json, callback) {
		analize(json, argv.id ,callback)
	}
], function(err, result) {
	console.log("done")
});