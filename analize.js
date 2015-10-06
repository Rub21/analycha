var _ = require('underscore');
var turf = require('turf');
var fs = require('fs');
var async = require('async');
module.exports = function(obj, id_changeset, cb) {
	var changes = turf.featurecollection([]);
	var count_distances = {};
	var count = {
		'node_total': 0,
		'node_create': 0,
		'node_modify': 0,
		'node_delete': 0
	}
	var num_nodes = 0;
	//Json and filter
	_.each(obj, function(val) {
		var fc = turf.featurecollection();

		if (val.type == 'node' && val.status == 'modify') {
			count.node_total++;
			count.node_modify++;
			var history = val.history;
			var p1, p2;
			//p1 = actual node
			//p2 previous node

			for (var i = 0; i < history.length; i++) {
				if (history[i].changeset === id_changeset) {
					p1 = turf.point([history[i].lon, history[i].lat]);
					p2 = turf.point([history[i - 1].lon, history[i - 1].lat]);
					//version
					p1.properties.version = history[i].version;
					p2.properties.version = history[i - 1].version;
				}
			}
			p1.properties.color = "#00f"
			p2.properties.color = "#999"
			var units = "kilometers";
			//TODO, need to improve, for now th easy way.
			var distance = (turf.distance(p1, p2, units) * 1000).toFixed(2) + "m";
			p1.properties.distance = distance; //cuanto de distacia ha sido movido de la version anterior
			changes.features.push(p1);
			changes.features.push(p2);
			//here will count how many nodes has same distances from previous version to actual version
			if (count_distances[distance] !== undefined) {
				count_distances[distance] = count_distances[distance] + 1;
			} else {
				count_distances[distance] = 1;
			}
		}
		if (val.type == 'node' && val.status == 'create') {
			count.node_total++;
			count.node_create++;
		}
		if (val.type == 'node' && val.status == 'delete') {
			count.node_total++;
			count.node_delete++;

		}
	});

	fs.writeFile(id_changeset + '.json', JSON.stringify(changes));
	console.log("Number of nodes");
	console.log("===============");
	console.log("Nodes : " + JSON.stringify(count));
	console.log("Number of nodes were updated at same distance");
	console.log("=============================================");
	console.log(count_distances);
	cb();

}