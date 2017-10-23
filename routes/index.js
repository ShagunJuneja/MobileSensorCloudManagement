
/*
 * GET Login page.
 */

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

exports.index = function(req, res){
	res.render('index', { title: "Mobile Sensor Cloud",errMsg: "" });
};


exports.login = function(req, res){
	
	try {
		var param = req.body;
		var errMsg = '';
		if(param.btnRegister != "Join Now"){
			
			if(param.inputEmail == "" || param.inputEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else if(param.inputPassword == "" || param.inputPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else{
				var url = 'mongodb://localhost:27017/MobileSensorCloud';
				MongoClient.connect(url, function (err, db) {
					  if (err) {
					    console.log('Unable to connect to the mongoDB server. Error:', err);
					  } else {
					    //HURRAY!! We are connected. :)
					    console.log('Connection established to:', url);

					    // Get the documents collection
					    var collection = db.collection('users');
					   
					    collection.find({"email":param.inputEmail,"password":param.inputPassword}).toArray(function (err, result) {
					        if (err) {
					          console.log(err);
					        } else if (result.length) {
					          console.log('Found:', result);
					          console.log("valid Login");								
					          
					          res.redirect('/dashboard');
					        } else {
					          console.log('No document(s) found with defined "find" criteria!');
					          console.log("Invalid Login");
					          res.render('index', { title: 'Mobile Sensor CLoud',errMsg: "Invalid Login" });
					        }
					        //Close connection
					        db.close();
					      });
					  }
					});
			}
		}
		else{
			console.log("0000000");
			if(param.txtEmail == "" || param.txtEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else if(param.txtPassword == "" || param.txtPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else if(param.txtFirstName == "" || param.txtFirstName == "undefined"){
				errMsg += 'First Name is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else if(param.txtLastName == "" || param.txtLastName == "undefined"){
				errMsg += 'Last Name is required.';
				res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
			}
			else
			{
				var url = 'mongodb://localhost:27017/MobileSensorCloud';
				MongoClient.connect(url, function (err, db) {
					  if (err) {
					    console.log('Unable to connect to the mongoDB server. Error:', err);
					  } else {
					    //HURRAY!! We are connected. :)
					    console.log('Connection established to:', url);

					    // Get the documents collection
					    var collection = db.collection('users');
					   
					    collection.find({"email":param.txtEmail}).toArray(function (err, result) {
					        if (err) {
					          console.log(err);
					        } else if (result.length) {
					        	res.render('index', { title: 'Mobile Sensor Cloud',errMsg: "User Already Exists." });
					        	
					        } else {
					        	collection.insert({
					        	    "firstname" : param.txtFirstName,
					        	    "lastname" : param.txtLastName,
					        	    "email" : param.txtEmail,
					        	    "password" : param.txtPassword
				        		}, function (err, result) {
				        	    if (err) {
				        	      console.log(err);
				        	    }
				        	    else {
				        	      //console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				        	      //req.session.userunkid =  result.insertedIds[0];
				        	      res.redirect('/dashboard');
				        	    }
				        	    
				        	  }); 
					        }
					        //Close connection
					       // db.close();
					      });
					  }
					});
			}
			
			//res.render('index', { title: 'LinkedIn',errMsg: errMsg });
		}
		
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
	
	
};