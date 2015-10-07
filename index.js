var changeset = require('./changeset');
var history = require('./history');
var analize = require('./analize');
var config = require('./config');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');

var url = config.api + 'changeset/' + argv.idchangeset + '/download';

async.waterfall([
	function(callback) {
		changeset(url, callback);
	},
	function(json, callback) {
		history(json, callback);
	},
	function(json, callback) {
		analize(json, argv.idchangeset, callback)
	}
], function(err, result) {
	console.log("done")
});