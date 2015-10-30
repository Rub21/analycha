var _ = require('underscore');
var async = require('async');
var config = require('./config');
var fs = require('fs');
var turf = require('turf');

module.exports = function(id, json, cb) {
	var user = {};
	var changesets = {};
	var type = ['create', 'modify', 'delete'];

	_.each(json.osm.action, function(v, k) {
		if (v.type === "modify") {
			if (v.new.node !== undefined) {
				//new node
				var point_new = turf.point([v.new.node.lon, v.new.node.lat]);
				point_new.properties.id = v.new.node.id;
				point_new.properties.version = v.new.node.version;
				point_new.properties.timestamp = v.new.node.timestamp;
				point_new.properties.type = v.type;

				//old node
				var point_old = turf.point([v.old.node.lon, v.old.node.lat]);
				point_old.properties.id = v.old.node.id;
				point_old.properties.version = v.old.node.version;
				point_old.properties.timestamp = v.old.node.timestamp;
				point_new.properties.type = v.type;

				if (changesets[v.new.node.changeset] === undefined) {

					var change = turf.featurecollection([point_new, point_old]);
					change.changeset = v.new.node.changeset;
					change.uid = v.new.node.uid;
					change.user = v.new.node.user;
					change.num_modify = 1;
					change.timestamp = (new Date(v.new.node.timestamp)).getTime() / 1000;
					changesets[v.new.node.changeset] = change;
				} else {
					changesets[v.new.node.changeset].num_modify = changesets[v.new.node.changeset].num_modify + 1;
					changesets[v.new.node.changeset].timestamp = (new Date(v.new.node.timestamp)).getTime() / 1000;
					changesets[v.new.node.changeset].features.push(point_new);
					changesets[v.new.node.changeset].features.push(point_old);
				}
			} else if (v.new.way !== undefined) {
				//new node
				var nodes_new_way = [];
				_.each(v.new.way.nd, function(val, key) {
					nodes_new_way.push([val.lon, val.lat]);
				});
				var linestring_new = turf.linestring(nodes_new_way);
				linestring_new.properties.id = v.new.way.id;
				linestring_new.properties.version = v.new.way.version;
				linestring_new.properties.timestamp = v.new.way.timestamp;
				linestring_new.properties.type = v.type;

				//old node
				var nodes_old_way = [];
				_.each(v.old.way.nd, function(val, key) {
					nodes_old_way.push([val.lon, val.lat]);
				});
				var linestring_old = turf.linestring(nodes_old_way);
				linestring_old.properties.id = v.old.way.id;
				linestring_old.properties.version = v.old.way.version;
				linestring_old.properties.timestamp = v.old.way.timestamp;
				linestring_old.properties.type = v.type;

				if (changesets[v.new.way.changeset] === undefined) {
					var change = turf.featurecollection([linestring_new, linestring_old]);
					change.changeset = v.new.way.changeset;
					change.uid = v.new.way.uid;
					change.user = v.new.way.user;
					change.num_modify = 1;
					change.timestamp = (new Date(v.new.way.timestamp)).getTime() / 1000;
					changesets[v.new.way.changeset] = change;

				} else {
					changesets[v.new.way.changeset].num_modify = changesets[v.new.way.changeset].num_modify + 1;
					changesets[v.new.way.changeset].timestamp = (new Date(v.new.way.timestamp)).getTime() / 1000;
					changesets[v.new.way.changeset].features.push(linestring_new);
					changesets[v.new.way.changeset].features.push(linestring_old);
				}
			}
		} else if (v.type === "delete") {
			if (v.old.node !== undefined) {
				//old node
				var point_old = turf.point([v.old.node.lon, v.old.node.lat]);
				point_old.properties.id = v.old.node.id;
				point_old.properties.version = v.old.node.version;
				point_old.properties.timestamp = v.old.node.timestamp;
				point_old.properties.type = v.type;

				if (changesets[v.old.node.changeset] === undefined) {
					var change = turf.featurecollection([point_old]);
					change.changeset = v.old.node.changeset;
					change.uid = v.old.node.uid;
					change.user = v.old.node.user;
					change.num_delete = 1;
					change.timestamp = (new Date(v.old.node.timestamp)).getTime() / 1000;
					changesets[v.old.node.changeset] = change;


				} else {
					changesets[v.old.node.changeset].num_delete = changesets[v.old.node.changeset].num_delete + 1;
					changesets[v.old.node.changeset].timestamp = (new Date(v.old.node.timestamp)).getTime() / 1000;
					changesets[v.old.node.changeset].features.push(point_old);
				}
			} else if (v.old.way !== undefined) {
				//old node
				var nodes_old_way = [];
				_.each(v.old.way.nd, function(val, key) {
					nodes_old_way.push([val.lon, val.lat]);
				});
				var linestring_old = turf.linestring(nodes_old_way);
				linestring_old.properties.id = v.old.way.id;
				linestring_old.properties.version = v.old.way.version;
				linestring_old.properties.timestamp = v.old.way.timestamp;
				linestring_old.properties.type = v.type;

				if (changesets[v.old.way.changeset] === undefined) {
					var change = turf.featurecollection([linestring_old]);
					change.changeset = v.old.way.changeset;
					change.uid = v.old.way.uid;
					change.user = v.old.way.user;
					change.num_delete = 1;
					change.timestamp = (new Date(v.old.way.timestamp)).getTime() / 1000;
					changesets[v.old.way.changeset] = change;

				} else {
					changesets[v.old.way.changeset].num_delete = changesets[v.old.way.changeset].num_delete + 1;
					changesets[v.old.way.changeset].timestamp = (new Date(v.old.way.timestamp)).getTime() / 1000;
					changesets[v.old.way.changeset].features.push(linestring_old);
				}
			}
		} else if (v.type === "create") {
			if (v.node !== undefined) {
				//old node
				var point = turf.point([v.node.lon, v.node.lat]);
				point.properties.id = v.node.id;
				point.properties.version = v.node.version;
				point.properties.timestamp = v.node.timestamp;
				point.properties.type = v.type;

				if (changesets[v.node.changeset] === undefined) {
					var change = turf.featurecollection([point]);
					change.changeset = v.node.changeset;
					change.uid = v.node.uid;
					change.user = v.node.user;
					change.num_create = 1;
					change.timestamp = (new Date(v.node.timestamp)).getTime() / 1000;
					changesets[v.node.changeset] = change;

				} else {
					changesets[v.node.changeset].num_create = changesets[v.node.changeset].num_create + 1;
					changesets[v.node.changeset].timestamp = (new Date(v.node.timestamp)).getTime() / 1000;
					changesets[v.node.changeset].features.push(point);
				}
			} else if (v.way !== undefined) {
				//old node
				var nodes_old_way = [];
				_.each(v.way.nd, function(val, key) {
					nodes_old_way.push([val.lon, val.lat]);
				});
				var linestring = turf.linestring(nodes_old_way);
				linestring.properties.id = v.way.id;
				linestring.properties.version = v.way.version;
				linestring.properties.timestamp = v.way.timestamp;
				linestring.properties.type = v.type;

				if (changesets[v.way.changeset] === undefined) {
					var change = turf.featurecollection([linestring]);
					change.changeset = v.way.changeset;
					change.uid = v.way.uid;
					change.user = v.way.user;
					change.num_create = 1;
					change.timestamp = (new Date(v.way.timestamp)).getTime() / 1000;
					changesets[v.way.changeset] = change;

				} else {
					changesets[v.way.changeset].num_create = changesets[v.way.changeset].num_create + 1;
					changesets[v.way.changeset].timestamp = (new Date(v.way.timestamp)).getTime() / 1000;
					changesets[v.way.changeset].features.push(linestring);
				}
			}
		}

	});

	var array_changesets = [];
	var array_users = [];

	_.each(changesets, function(val, key) {
		//if (config.users.indexOf(val.user) > 0) {
			array_changesets.push(val);
			var info = {
				"changeset": val.changeset,
				"uid": val.uid,
				"user": val.user,
				"num_delete": val.num_delete,
				"timestamp": val.timestamp
			};

			array_users.push(info);
			fs.writeFile('public/changeset_files/' + key + '.json', JSON.stringify(val));
		//}
	});

	//fs.writeFile('changeset_files/diff-' + id.toString() + '.json', JSON.stringify(changesets));
	//fs.writeFile(id.toString() + '-array.json', JSON.stringify(array_changesets));
	cb(null, array_users);
}