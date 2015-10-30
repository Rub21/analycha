require('mapbox.js');
var st = require('./settings')
var socket = require('socket.io-client')(st.host);
var _ = require('underscore');
var turf = require('turf');

document.location.hash = '';
var token = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
var mapid = 'ruben.n9e0l5jk';
L.mapbox.accessToken = token;
var map = L.mapbox.map('map', mapid, {
	infocontrol: true,
	zoomControl: false,
	center: [0, 0],
	zoom: 2
});
new L.Control.Zoom({
	position: 'topright'
}).addTo(map);
//var myLayer = L.mapbox.featureLayer().addTo(map);


socket.on("newchangest", newchangest);

function newchangest(obj) {
	console.log(obj)
	var ul = document.getElementById("list");
	ul.innerHTML = '';
	_.each(obj, function(val) {
		var li = document.createElement("li");
		li.setAttribute("id", val.changeset);
		//var a = document.createElement("a");
		//a.innerHTML = val.changeset;
		//a.href = "http://localhost:3000?idchangeset=" + val.changeset;


		//li.appendChild(document.createTextNode(val.user));

		li.innerHTML = '<a href="#" onclick="load(' + val.changeset + ')">' + val.user + '-' + val.changeset + '</a>'


		//li.appendChild(a)
		ul.appendChild(li);
	})
}



function load(id) {
	alert(id)
}
var colors = {
	"create": "#04ff00",
	"modify": "#0043ff",
	"delete": "#ff0000",
	"old": "#000"
};

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


getJSON("/changeset_files/" + document.URL.split("?idchangeset=")[1] + ".json").then(function(data) {
	for (var i = 0; i < data.features.length; i++) {
		var f = data.features[i];
		if (f.geometry.type == "Point") {
			var circle_options = {
				color: colors[f.properties.type],
				opacity: 1,
				weight: 2,
				fillColor: colors[f.properties.type],
				fillOpacity: 0.6
			};
			var point = L.circle(f.geometry.coordinates.reverse(), 2, circle_options).addTo(map);
			point.bindPopup('<strong>' + f.properties.id + '</strong><br><span>Version :' + f.properties.version + '</span>');

		} else if (f.geometry.type == "LineString") {
			var weight = 2;
			(f.properties.type == "old") ? weight = 3: weight = 10;
			var polyline_options = {
				color: colors[f.properties.type],
				weight: weight
			};
			var coor = [];
			for (var j = 0; j < f.geometry.coordinates.length; j++) {
				coor.push(f.geometry.coordinates[j].reverse());
			};
			var line = L.polyline(coor, polyline_options).addTo(map);
			line.bindPopup('<strong>' + f.properties.id + '</strong><br><span>Version :' + f.properties.version + '</span>');
		}
	};
	document.getElementById("map").classList.remove('loading');
}, function(status) {
	alert('not yet the id geojson');
	document.getElementById("map").classList.remove('loading');
});