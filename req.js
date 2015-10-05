var parser = require('xml2json');
var request = require('request');
var fs = require('fs');

var options = {
	object: true,
	reversible: false,
	coerce: true,
	sanitize: true,
	trim: true,
	arrayNotation: false
};

module.exports = function(url, cb) {
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = parser.toJson(body, options);
			cb(null,json);
		} else {
			cb(null,error);
		}
	});

}