let async = require('async');

console.log(`Program start`);
async.waterfall([
	function (callback) {
		console.log("First step----");
		callback(null, '1', '2');
	},
	function(arg1, arg2, callback) {
		console.log(`Second step----${arg1}, ${arg2}`);
		callback(null,'3');
	},
	function(arg3) {
		console.log(`Third step----${arg3}`);
	}
]);