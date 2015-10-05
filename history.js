var _ = require('underscore');
var parser = require('xml2json');
var request = require('request');
var async = require('async');

var options = {
	object: true,
	reversible: false,
	coerce: true,
	sanitize: true,
	trim: true,
	arrayNotation: false
};


var status = ['create', 'modify', 'delete'];
var url_base = "http://www.openstreetmap.org/api/0.6/node/";
var N = 20; // numero de tareas
module.exports = function(json, cb) {
	var result = [];
	//segundo paso
	var q = async.queue(function(task, callback) {
		console.log(task.url)
		request(task.url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = parser.toJson(body, options);
				//console.log(json);
				task.history = json.osm;
				result.push(task);
				callback();
			} else {
				callback();
			}
		});
	}, N);
	//tercer paso back
	q.drain = function() {
			cb(null, result);
		}
		//primer paso en aqui
	for (var i = 0; i < status.length; i++) {
console.log(json.osmChange[status[i]])

		_.each(json.osmChange[status[i]], function(val) {
			val.status = status[i];
			if (val.node !== undefined) {
				val.url = url_base + val.node.id + "/history";
				q.push(val)
			} else if (val.way !== undefined) {
				val.url = url_base + val.way.id + "/history";
				q.push(val)
			} else if (val.relation !== undefined) {
				val.url = url_base + val.relation.id + "/history";
				q.push(val)
			}
		});
	};


}