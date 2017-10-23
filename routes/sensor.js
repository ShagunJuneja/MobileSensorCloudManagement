/*
 * GET Sensor page.
*/
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
exports.load = function(req, res){
	
	
	res.render('sensor', { title: 'Sensor Management'});
	
};

exports.addSensor = function(req, res){
	var param = req.body;
	var errMsg = '';
	var url = 'mongodb://localhost:27017/MobileSensorCloud';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else {
		    //HURRAY!! We are connected. :)
		    console.log('Connection established to:', url);

		    // Get the documents collection
		    var collection = db.collection('userSensor');
		    collection.insert({
        	    "location" : param.location,
        	    "type" : param.type,
        	    "status" : param.status,
        	    "email" : "dhvani@gmail.com"
    		}, function (err, result) {
	    	    if (err) {
	    	      console.log(err);
	    	    }
	    	    else {
	    	    	res.send({"errMsg":"Success"});
    	    
	    	    }
    		});
		}
	});
	
};

exports.getAllSensors = function(req, res){
	var param = req.body;
	var errMsg = '';
	var url = 'mongodb://localhost:27017/MobileSensorCloud';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else {
		    //HURRAY!! We are connected. :)
		    console.log('Connection established to:', url);

		    // Get the documents collection
		    var collection = db.collection('userSensor');
		    collection.find({"email":"dhvani@gmail.com"}).toArray(function (err, result) {
		        if (err) {
		        	res.send({"errMsg":err});
		        } else if (result.length) {
		        	res.send({"errMsg":"Success","data":result});
		        } else {
		        	res.send({"errMsg":"No data found"});
		        }
		        //Close connection
		        db.close();
		      });
		}
	});
	
};