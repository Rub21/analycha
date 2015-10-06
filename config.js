module.exports = {
	api: "https://www.openstreetmap.org/api/0.6/",
	options: { //for json
		object: true,
		reversible: false,
		coerce: true,
		sanitize: true,
		trim: true,
		arrayNotation: false
	},
	N: 100 // numero de tareas para ejecutar en la pila
}