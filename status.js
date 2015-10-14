var request = require('request');
var fs = require('fs');
var config = require('./config');

module.exports = function(cb) {
	var url = config.api_status;
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			
			cb(null, body.toString());
		} else {
			cb(null, error);
		}
	});

}