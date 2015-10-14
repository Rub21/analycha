module.exports = {
	api: "https://www.openstreetmap.org/api/0.6/",
	api_status: "http://overpass-api.de/api/augmented_diff_status",
	augmented_diff: "http://overpass-api.de/api/augmented_diff?id=",
	change: function() {
		return {
			"changeset": null,
			"uid": null,
			"user": null,
			"objects": [],
			"type": null,
			"num": 0
		}
	},
	options: { //for json
		object: true,
		reversible: false,
		coerce: true,
		sanitize: true,
		trim: true,
		arrayNotation: false
	},
	N: 50 // numero de tareas para ejecutar en la pila
}