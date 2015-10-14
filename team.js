var _ = require('underscore');
var async = require('async');
var config = require('./config');
var fs = require('fs');

var user = {};
var changesets = {};
var type = ['create', 'modify', 'delete'];
module.exports = function(id, json, cb) {

	_.each(json.action, function(v, k) {
		if (v.type === "modify") {
			if (v.new.node !== undefined) {

				v.new.node.changeset
			}
		}

	});

	fs.writeFile(id + '.json', JSON.stringify(json));
	cb();
}