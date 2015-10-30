var parser = require('xml2json');
var request = require('request');
var fs = require('fs');
var config = require('./config');

module.exports = function(id, cb) {
	request(config.augmented_diff + id, function(error, response, body) {
		console.log(config.augmented_diff + id);
		if (!error && response.statusCode == 200) {
			var json = parser.toJson(body, config.options);
			cb(null, id, json);
		} else {
			cb(null, id, null);
		}
	});

}