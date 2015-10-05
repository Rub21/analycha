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

module.exports = function(json, cb) {
	var result = [];
	var N = 20; // numeor de tareas
	//segundo paso
	var q = async.queue(function(task, callback) {
		var url = "http://www.openstreetmap.org/api/0.6/node/" + task.node.id + "/history";
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = parser.toJson(body, options);
				//console.log(json);
				task.node.history = json.osm.node;
				result.push(task);
				callback();
			} else {
				callback();
			}
		});
	}, N);
	//terser paso back
	q.drain = function() {
			cb(null,result);
		}
		//empieza en aqui
	_.each(json.osmChange.modify, function(val) {
		if (val.node !== undefined) {
			q.push(val)
		}
	});
}