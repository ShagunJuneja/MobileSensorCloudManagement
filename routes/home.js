/*
 * GET home page.
*/
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
exports.load = function(req, res){
	
	
	res.render('dashboard', { title: 'Dashboard'});
	
};

