var _ = require('underscore');
var parser = require('xml2json');
var request = require('request');
var async = require('async');
var config = require('./config');
var status = ['create', 'modify', 'delete'];
module.exports = function(json, cb) {
	var result = [];
	//segundo paso
	var q = async.queue(function(task, callback) {
		request(task.url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = parser.toJson(body, config.options);
				//console.log(json);
				task.history = json.osm[task.type];
				result.push(task);
				callback();
			} else {
				callback();
			}
		});
	}, config.N);
	//tercer paso back
	q.drain = function() {
			cb(null, result);
		}
		//primer paso en aqui
	for (var i = 0; i < status.length; i++) {
		_.each(json.osmChange[status[i]], function(val) {
			val.status = status[i];
			if (val.node !== undefined) {
				val.url = config.api + "node/" + val.node.id + "/history";
				val.type = "node";
				q.push(val)
			} else if (val.way !== undefined) {
				val.url = config.api + "way/" + val.way.id + "/history";
				val.type = "way";
				q.push(val)
			} else if (val.relation !== undefined) {
				val.url = config.api + "relation/" + val.relation.id + "/history";
				val.type = "relation";
				q.push(val)
			}
		});
	};


}