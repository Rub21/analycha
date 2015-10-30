var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongodb://localhost:27017/dbchangeset';
var myCollection = "osm";
var dbConn;

MongoClient.connect(dbHost, function(err, db) {
	if (err) throw err;
	console.log("connect");
	dbConn = db;
});

module.exports = {

	insertUser: function(user) {
		dbConn.collection(myCollection).insert(user, function(err, recs) {
			if (err) throw err;
			//console.log("Successfully inserted the user into database");
		});
	},

	listUsers: function() {
		dbConn.collection(myCollection).find({}, {}, {}).toArray(
			function(err, docs) {
				for (index in docs) {
					//console.log(docs[index]);
				}
			}
		);
	},

	updateUser: function(id, user) {
		dbConn.collection(myCollection).update({
			"isbn": id
		}, user, function(err, recs) {
			if (err) throw err;
			//console.log("Successfully updated the user");
		});
	},

	deleteUser: function(id) {
		dbConn.collection(myCollection).remove({
			"isbn": id
		}, function(err, recs) {
			if (err) throw err;
			//console.log("Successfully deleted the user");
		});
	},
	InsertUsers: function(arr) {
		_.each(arr, function(val) {
			dbConn.collection(myCollection).insert(val, function(err, recs) {
				if (err) throw err;
				//console.log("Successfully inserted the user into database");
			});
		});
	}
}