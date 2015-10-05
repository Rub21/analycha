var _ = require('underscore');
var U = require('./req');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');


var url = 'https://www.openstreetmap.org/api/0.6/changeset/' + argv.id + '/download';


function hello(callback) {
	console.log("hello")
	callback()
}

async.series([
	function(callback) {
		console.log("uno");
		U(url, callback);
	},
	hello
], function(err) {
	console.log('all functions complete');

});



// var async = require('async')
// var param1 = 'foobar'
// function withParams(param1, callback) {
//   console.log('withParams function called')
//   console.log(param1)
//   callback()
// }
// function withoutParams(callback) {
//   console.log('withoutParams function called')
//   callback()
// }
// async.series([
//   function(callback) {
//     withParams(param1, callback)
//   },
//   withoutParams
// ], function(err) {
//   console.log('all functions complete')
// })
