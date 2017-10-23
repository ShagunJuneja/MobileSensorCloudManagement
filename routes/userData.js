/**
 * User Sensor Data file
 */

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

exports.userSensorData = function (req,res){
	var url = 'mongodb://localhost:27017/MobileSensorCloud';
	var dataResult=[];
	var dataSC = [];
	var dataSV = [];
	var dataSJ = [];
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			//HURRAY!! We are connected. :)
			console.log('Connection established to:', url);

			// Get the documents collection
			var collection = db.collection('userSensor');

			collection.find({"email":req.params.email}).toArray(function (err, result) {
				if (err) {
					console.log(err);
				} else if (result.length) {
					console.log('Found:', result);
					var sensorListSJ = [];
					var sensorListSV = [];
					var sensorListSC = [];
					for(var i=0; i<result.length; i++) {
						if(result[i].location == "San Jose"){
							sensorListSJ.push(
									result[i].sensor
							);
						}else if(result[i].location == "Santa Clara"){
							sensorListSC.push(
									result[i].sensor
							);
						}else if(result[i].location == "Sunnyvale"){
							sensorListSV.push(
									result[i].sensor
							);
						}

					}
					
					var collectionSJ = db.collection('sensorDataSJ');

					collectionSJ.aggregate([{ $match: { sensor: {$in:sensorListSJ} } }, {$sort:{timestamp:-1}},{ $group : {"_id" : "$sensor",
						data:{$push : "$value"},time:{$push : "$timestamp"}}}]).toArray(function (error, resultSJ){
							if (error){
								console.log(error);
							}else if(resultSJ.length){
								dataResult.push({
									"dataSJ" : resultSJ
								});
							}
						});
					
					var collectionSV = db.collection('sensorDataSV');

					collectionSV.aggregate([{ $match: { sensor: {$in:sensorListSV} } }, {$sort:{timestamp:-1}},{ $group : {"_id" : "$sensor",
						data:{$push : "$value"},time:{$push : "$timestamp"}}}]).toArray(function (error, resultSV){
							if (error){
								console.log(error);
							}else if(resultSV.length){
								dataResult.push({
									"dataSV" : resultSV
								});
							}
						});
					
					var collectionSC = db.collection('sensorDataSC');

					collectionSC.aggregate([{ $match: { sensor: {$in:sensorListSC} } }, {$sort:{timestamp:-1}},{ $group : {"_id" : "$sensor",
						data:{$push : "$value"},time:{$push : "$timestamp"}}}]).toArray(function (error, resultSC){
							if (error){
								console.log(error);
							}else {
								if(resultSC.length){
									dataResult.push({
										"dataSC" : resultSC
									});
								}
								//console.log(dataResult[0].dataSJ[1].data[0]);
								res.status(200).json({
									"value" : dataResult
								});
							}
						});
					
				} else {
					console.log('No document(s) found with defined "find" criteria!');
					console.log("Invalid Login");
					res.render('index', { title: 'Mobile Sensor CLoud',errMsg: "Invalid Login" });
				}
				//Close connection
				//db.close();
			});
		}
	});
	
};