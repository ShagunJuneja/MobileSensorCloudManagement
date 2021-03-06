
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , home = require('./routes/home')
  , dashboard = require('./routes/dashboard')
  , sensor = require('./routes/dataCollector')
  , mysensor = require('./routes/sensor')
  , user = require('./routes/userData')
  , mongodb = require('mongodb')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/', routes.index);
app.post('/', routes.login);
app.get('/dashboard', dashboard.load);
app.post('/addSensor', sensor.addSensor);
app.get('/sensors', mysensor.getAllSensors);*/

app.get('/', routes.index);
app.post('/', routes.login);
app.get('/dashboard', dashboard.load);
app.get('/home', home.load);
app.post('/addSensor', mysensor.addSensor);
app.get('/sensors', mysensor.getAllSensors);

app.del('/api/session',function(req,res){
	if(req.session.data){
		req.session.destroy();
		res.send(JSON.stringify({"response" : "Session Destroyed"}));
	}else{
		res.send(JSON.stringify({"response" : "No Session Data to DELETE"}));
	}
});

/****** Sensor Calls *******/
app.get('/api/getSensorData', sensor.startCronJob);
app.get('/api/getDashboardData/:email', user.userSensorData);
app.get('/api/getSensorHealth/:location', sensor.checkSensorHealth);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
