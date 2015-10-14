var _ = require('underscore');
var async = require('async');
var config = require('./config');
var fs = require('fs');
var turf = require('turf');

module.exports = function(id, json, cb) {
	var user = {};
	var changesets = {};
	var type = ['create', 'modify', 'delete'];

	//var changes = turf.featurecollection([]);


	_.each(json.osm.action, function(v, k) {
		if (v.type === "modify") {
			if (v.new.node !== undefined) {
				//new node
				var point_new = turf.point([v.new.node.lon, v.new.node.lat]);
				point_new.properties.id = v.new.node.id;
				point_new.properties.version = v.new.node.version;
				point_new.properties.timestamp = v.new.node.timestamp;

				//old node
				var point_old = turf.point([v.old.node.lon, v.old.node.lat]);
				point_old.properties.id = v.old.node.id;
				point_old.properties.version = v.old.node.version;
				point_old.properties.timestamp = v.old.node.timestamp;

				if (changesets[v.new.node.changeset] === undefined) {
					var change = turf.featurecollection([point_new, point_old]);
					change.changeset = v.new.node.changeset;
					change.uid = v.new.node.uid;
					change.user = v.new.node.user;
					changesets[v.new.node.changeset] = change;


				} else {
					changesets[v.new.node.changeset].features.push(point_new);
					changesets[v.new.node.changeset].features.push(point_old);
				}
			}
		}

	});

	fs.writeFile(id + '.json', JSON.stringify(changesets));
	cb();
}