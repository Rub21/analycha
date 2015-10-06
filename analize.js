var _ = require('underscore');
var turf = require('turf');
var fs = require('fs');
module.exports = function(obj, id_changeset, cb) {
	var changes = turf.featurecollection([]);
	var count_distances = {};
	//Json and filter
	_.each(obj, function(val) {
		var fc = turf.featurecollection();
		if (val.type == 'node' && val.status == 'modify') {
			var h = val.history.reverse();
			var p1 = turf.point([h[0].lon, h[0].lat]);
			var p2 = turf.point([h[1].lon, h[1].lat]);
			p1.properties.color = "#00f"
			p2.properties.color = "#999"
			var units = "kilometers";
			var distance = (turf.distance(p1, p2, units) * 1000).toFixed(2) + "m";
			p1.properties.title = distance;
			changes.features.push(p1);
			changes.features.push(p2);
			fs.writeFile(id_changeset + '.json', JSON.stringify(changes));
			//here will count how many nodes has same distances from previous version to actual version
			if (count_distances[distance] !== undefined) {
				count_distances[distance] = count_distances[distance] + 1;
			} else {
				count_distances[distance] = 1;
			}
		}
	});
	console.log("Number of nodes were updated at same distance");
	console.log("=============================================");
	console.log(count_distances);
	cb();
}