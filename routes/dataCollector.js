/**
 * Data Collector file
 */

var request = require('request');
var cron = require('cron');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var URL_SJ = "http://api.openweathermap.org/data/2.5/weather?id=5392171&units=imperial&APPID=da4c909186011159c55a20d0af64d77a"; //San Jose

var URL_SV = "http://api.openweathermap.org/data/2.5/weather?id=5400075&units=imperial&APPID=da4c909186011159c55a20d0af64d77a"; //Sunnyvale

var URL_SC = "http://api.openweathermap.org/data/2.5/weather?id=5393015&units=imperial&APPID=da4c909186011159c55a20d0af64d77a"; //Santa Clara


function getSensorData(req, res, URL, collName){

	request(URL, function(error, response, body){
		if (!error && response.statusCode == 200) {
			console.log(JSON.stringify(body));
			console.log(JSON.parse(body));
			console.log(JSON.parse(body).name);
			console.log(JSON.parse(body).coord);
			console.log(JSON.parse(body).main.temp);
			console.log(JSON.parse(body).weather[0].description);
			var url = 'mongodb://127.0.0.1:27017/MobileSensorCloud';
			MongoClient.connect(url, function (err, db) {
				if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				else {
					//HURRAY!! We are connected. :)
					console.log('Connection established to:', url);

					// Get the documents collection
					var collection = db.collection(collName);
					collection.insert([
					                   {
					                	   "sensor" : "temperature",
					                	   "value": [JSON.parse(body).main.temp,JSON.parse(body).main.temp_min,JSON.parse(body).main.temp_max],
					                	   "timestamp" : new Date()
					                   },
					                   {
					                	   "sensor" : "pressure",
					                	   "value": JSON.parse(body).main.pressure,
					                	   "timestamp" : new Date()
					                   },
					                   {
					                	   "sensor" : "humidity",
					                	   "value": JSON.parse(body).main.humidity,
					                	   "timestamp" : new Date()
					                   },
					                   {
					                	   "sensor" : "windspeed",
					                	   "value": JSON.parse(body).wind.speed,
					                	   "timestamp" : new Date()
					                   }], function (err, result) {
						if (err) {
							console.log(err);
						}
						else {
							//res.send({"response":"Success"});

						}
					});
				}
			});
		}
	});


}

exports.startCronJob = function (req,res){
	getSensorData(req, res, URL_SJ, "sensorDataSJ");
	getSensorData(req, res, URL_SV, "sensorDataSV");
	getSensorData(req, res, URL_SC, "sensorDataSC");
	var cronJob = cron.job("0 */10 * * * *", function(){
		// perform operation e.g. GET request http.get() etc.
		getSensorData(req, res, URL_SJ, "sensorDataSJ");
		getSensorData(req, res, URL_SV, "sensorDataSV");
		getSensorData(req, res, URL_SC, "sensorDataSC");
		console.info('cron job completed');
	});
	cronJob.start();
};

exports.checkSensorHealth = function (req, res) {
	var loc = req.params.location;
	var URL;
	if(loc == "San Jose"){
		URL = URL_SJ;
	}else if(loc == "Santa Clara"){
		URL = URL_SC;
	}else if(loc == "Sunnyvale"){
		URL = URL_SV;
	}else{
		res.status(400).json({
			"msg" : "Invalid Sensor. Check sensor name and try again!"
		});
	}
	request(URL, function(error, response, body){
		if (!error && response.statusCode == 200) {
			res.status(200).json({
				"msg" : "The sensor is up and running!"
			});
		}else {
			res.status(400).json({
				"msg" : "Unable to connect to the sensor. Try again in sometime!"
			});
		}
	});
};




