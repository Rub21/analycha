var parser = require('xml2json');
var request = require('request');
var fs = require('fs');
var config = require('./config');

module.exports = function(url, cb) {
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = parser.toJson(body, config.options);
			cb(null,json);
		} else {
			cb(null,error);
		}
	});

}