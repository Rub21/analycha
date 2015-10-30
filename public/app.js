var colors = {
	"create": "#04ff00",
	"modify": "#0043ff",
	"delete": "#ff0000",
	"old": "#000"
};



L.mapbox.accessToken = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
var map = L.mapbox.map('map', 'ruben.ea0f35c8');
var getJSON = function(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status == 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	});
};


console.log("http://localhost:3000/changeset_files/" + document.URL.split("?idchangeset=")[1] + ".json")
getJSON("/changeset_files/" + document.URL.split("?idchangeset=")[1] + ".json").then(function(data) {
	console.log(data);

	for (var i = 0; i < data.features.length; i++) {

		var f = data.features[i];
		if (f.geometry.type == "Point") {
			console.log(f.properties.type)
			var circle_options = {
				color: colors[f.properties.type],
				opacity: 1,
				weight: 2,
				fillColor: colors[f.properties.type],
				fillOpacity: 0.6
			};
			var circle_one = L.circle(f.geometry.coordinates.reverse(), 2, circle_options).addTo(map);
		} else if (f.geometry.type == "LineString") {
			var weight = 2;
			(f.properties.type == "old") ? weight = 3: weight = 10;
			var polyline_options = {
				color: colors[f.properties.type],
				weight: weight,
				dashArray: '',
				fillOpacity: 0.7
			};
			var coor = [];
			for (var j = 0; j < f.geometry.coordinates.length; j++) {
				coor.push(f.geometry.coordinates[j].reverse());
			};
			var polyline = L.polyline(coor, polyline_options).addTo(map);
		}

	};
	document.getElementById("map").classList.remove('loading');
}, function(status) {
	alert('Something went wrong. Load again your geojson');
	document.getElementById("map").classList.remove('loading');
});