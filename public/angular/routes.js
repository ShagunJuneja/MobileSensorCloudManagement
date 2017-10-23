var app = angular.module('sensorcloud', ['ngRoute']);


app.config(['$routeProvider',
            function($routeProvider,$locationProvider) {
				$routeProvider.
				when('/dashboard', {
					templateUrl: '/html/dashboard.html',
					controller: 'dashboardController'
     
				}).
				when('/sensor-management', {
					templateUrl: '/html/sensor-management.html',
					controller: 'managementController'
     
				}).
				when('/sensor-monitor', {
					templateUrl: 'monitor.html',
					controller: 'monitorController'
     
				}).
				when('/billing', {
					templateUrl: 'billing.html',
					controller: ''
     
				}).
                otherwise({
                  redirectTo: '/dashboard',
                });
              //$locationProvider.html5Mode(true);
          }

]);



app.controller('logoutController',function($scope,$http){
	$scope.logout = function() {
		window.location = '/';
	}
	/*$http({
	    method: 'DELETE',
	    url: '/api/session',
	    
	 }).success(function(response){
	   
	    console.log(response);
	    window.location = '/';
	}).error(function(error){
	    alert("error");
	});*/

});


app.controller('dashboardController', function($scope,$http) {
	
	//Dhvani Shah - 13-Apr-2016  - Display Maps - START
	var gPTMCords = new google.maps.LatLng(50.43, 30.60);
    var gPTMOptions = {zoom: 8,center: gPTMCords, mapTypeId: google.maps.MapTypeId.ROADMAP}    
    var gPTM = new google.maps.Map(document.getElementById("google_ptm_map"), gPTMOptions);        
    
    var cords = new google.maps.LatLng(50.37, 30.65);
    var marker = new google.maps.Marker({position: cords, map: gPTM, title: "Sensor 1", description: "Temperature Sensor"});    
    cords = new google.maps.LatLng(50.5, 30.55);
    marker = new google.maps.Marker({position: cords, map: gPTM, title: "Sensor 2"});
    cords = new google.maps.LatLng(50.8, 30.55);
    marker = new google.maps.Marker({position: cords, map: gPTM, title: "Sensor 3"});
    //Dhvani Shah - 13-Apr-2016  - Display Maps - END
    
    //Dhvani Shah - 13-Apr-2016  - Display Charts - START
    
    $http.get("/api/getDashboardData/dhvani@gmail.com").success(function(response){
    	//var data = response[0];
    	//console.log(JSON.stringify(response.value));
    	$(response.value).each(function(index,obj){
			//console.log("index"+index);
			//console.log(JSON.stringify(obj));
			if(obj.hasOwnProperty("dataSJ")){
				console.log(obj.dataSJ);
				$(obj.dataSJ).each(function(k,v){
					if(v._id=="pressure"){
						var presseureArr = [];
						var timeArr = [];
						$(v.data).each(function(i,val){
							presseureArr.push(val);
						});
						$(v.time).each(function(i,val2){
							timeArr.push(val2);
						});
						console.log(presseureArr);
						console.log(timeArr);
					}
				});
				
				
					var pressure = obj.dataSJ[1].data[0];
				var time = obj.dataSJ[1].time[0];
				console.log(time+" | "+pressure);
			}
		});
    });
    
    var morrisCharts = function() {

        Morris.Line({
          element: 'morris-line-example',
          data: [
            { y: '2006', a: 100, b: 90 },
            { y: '2007', a: 75,  b: 65 },
            { y: '2008', a: 50,  b: 40 },
            { y: '2009', a: 75,  b: 65 },
            { y: '2010', a: 50,  b: 40 },
            { y: '2011', a: 75,  b: 65 },
            { y: '2012', a: 100, b: 90 }
          ],
          xkey: 'y',
          ykeys: ['a', 'b'],
          labels: ['Temperature', 'Pressure', 'Humidity'],
          resize: true,
          lineColors: ['#33414E', '#95B75D']
        });

    }();
    //Bar chart
    Morris.Bar({
        element: 'morris-bar-example',
        data: [
            { y: 'March', a: 100, b: 90, c:34 },
            { y: 'April', a: 75,  b: 65, c:56 },
            { y: 'May', a: 50,  b: 40, c:25 },
        ],
        xkey: 'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['Temperature', 'Pressure', 'Humidity'],
        barColors: ['#B64645', '#33414E', '#95b75d']
    });
    // Donut Chart
    Morris.Donut({
        element: 'morris-donut-example',
        data: [
				{label: "Active Sensors", value: 3},
				{label: "Total Sensors", value: 9},
				{label: "Terminated Sensors", value: 3}
        ],
        colors: ['#95B75D', '#B64645', '#FEA223']
    });
    // Chart 2
    var nvd3Charts = function() {
    	
        var myColors = ["#33414E","#8DCA35","#00BFDD","#FF702A","#DA3610",
                        "#80CDC2","#A6D969","#D9EF8B","#FFFF99","#F7EC37","#F46D43",
                        "#E08215","#D73026","#A12235","#8C510A","#14514B","#4D9220",
                        "#542688", "#4575B4", "#74ACD1", "#B8E1DE", "#FEE0B6","#FDB863",                                                
                        "#C51B7D","#DE77AE","#EDD3F2"];
        d3.scale.myColors = function() {
            return d3.scale.ordinal().range(myColors);
        };
        
	
	var startChart2 = function() {
		nv.addGraph(function() {
			var chart = nv.models.scatterChart().showDistX(true)//showDist, when true, will display those little distribution lines on the axis.
			.showDistY(true).transitionDuration(350).color(d3.scale.myColors().range());;

			//Configure how the tooltip looks.
			chart.tooltipContent(function(key) {
                            return '<h3>' + key + '</h3>';
			});

			//Axis settings
			chart.xAxis.tickFormat(d3.format('.02f'));
			chart.yAxis.tickFormat(d3.format('.02f'));

			//We want to show shapes other than circles.
			chart.scatter.onlyCircles(false);

			var myData = randomData(3, 2);
			d3.select('#chart-2 svg').datum(myData).call(chart);

			nv.utils.windowResize(chart.update);

			return chart;
		});

		/**************************************
		 * Simple test data generator
		 */
		function randomData(groups, points) {//# groups,# points per group
			var data = [{"key":"Temperature","values":[]},{"key":"Pressure","values":[]},{"key":"Humidity","values":[]}];
			var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'], random = d3.random.normal();
			
			for ( var i = 0; i < groups; i++) {
				/*data.push({
					key : 'Group ' + i,
					values : []
				});*/
				
				for ( var j = 0; j < points; j++) {
					data[i].values.push({
						x : random(),
						y : random(),
						size : Math.random()//Configure the size of each scatter point
						,
						shape : (Math.random() > 0.95) ? shapes[j % 6] : "circle" //Configure the shape of each scatter point.
					});
				}
			}

			return data;
		}

	};
	

	function stream_layers(n, m, o) {
		if (arguments.length < 3)
			o = 0;
		function bump(a) {
			var x = 1 / (.1 + Math.random()), y = 2 * Math.random() - .5, z = 10 / (.1 + Math.random());
			for (var i = 0; i < m; i++) {
				var w = (i / m - y) * z;
				a[i] += x * Math.exp(-w * w);
			}
		}

		return d3.range(n).map(function() {
			var a = [], i;
			for ( i = 0; i < m; i++)
				a[i] = o + o * Math.random();
			for ( i = 0; i < 5; i++)
				bump(a);
			return a.map(stream_index);
		});
	}

	function stream_index(d, i) {
		return {
			x : i,
			y : Math.max(0, d)
		};
	}

	return {		
		init : function() {
			startChart2();
		}
	};
}();

nvd3Charts.init();
        

    //Dhvani Shah - 13-Apr-2016  - Display Charts - END
	//Dhvani Shah - 13-Apr-2016  - Display Clock - START
	var templatePlugins = function(){
	    
	    var tp_clock = function(){
	        
	        function tp_clock_time(){
	            var now     = new Date();
	            var hour    = now.getHours();
	            var minutes = now.getMinutes();                    
	            
	            hour = hour < 10 ? '0'+hour : hour;
	            minutes = minutes < 10 ? '0'+minutes : minutes;
	            
	            $(".plugin-clock").html(hour+"<span>:</span>"+minutes);
	        }
	        if($(".plugin-clock").length > 0){
	            
	            tp_clock_time();
	            
	            window.setInterval(function(){
	                tp_clock_time();                    
	            },10000);
	            
	        }
	    }
	    
	    var tp_date = function(){
	        
	        if($(".plugin-date").length > 0){
	            
	            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	                    
	            var now     = new Date();
	            var day     = days[now.getDay()];
	            var date    = now.getDate();
	            var month   = months[now.getMonth()];
	            var year    = now.getFullYear();
	            
	            $(".plugin-date").html(day+", "+month+" "+date+", "+year);
	        }
	        
	    }
	    
	    return {
	        init: function(){
	            tp_clock();
	            tp_date();
	        }
	    }
	}();
	templatePlugins.init(); 
	//Dhvani Shah - 13-Apr-2016  - Display Clock - END
    
    
});
app.controller('managementController', function($scope,$http) {
	
	$scope.sensordetails = [];		
	
	$scope.myFunction = function() {
			$scope.myVar="true";
			$scope.addsensorvar="false";
	}
	$scope.myFunction1 = function() {
			$scope.myVar1="true";
	}
	
	$scope.cancelSensorAdd = function() {
		$scope.getType='';
		$scope.getLocation='';
		$scope.myVar="false";
		$scope.addsensorvar="true";
	}
	$http.get("/sensors").success(function(response){
	console.log(response);
		if(response.errMsg == "Success"){
			$scope.myVar1="true";
			$(response.data).each(function(key,objSensor){
				$scope.sensordetails.push({'sensor':objSensor.sensor,'location':objSensor.location, 'status':objSensor.status});
			});
			
		}
	});
	$scope.sensorTypes=['Temperature','Pressure','Humidity','Gas'];
	$scope.sensorLocations=['San Diego','Los Angeles','Las Vegas','San Francisco','San Jose'];
	$scope.addSensor = function() {
		if ($scope.getType && $scope.getLocation) {
		//
			$http.post('/addSensor', {'type':$scope.getType,'location':$scope.getLocation, 'status': 'Stopped'}).
	  		success(function(data, status, headers, config) {
		  			$scope.sensordetails.push({'type':$scope.getType,'location':$scope.getLocation});
					var dataObj	=	{
								type : $scope.getType,
								location : $scope.getLocation
					};
					$scope.getType='';
					$scope.getLocation='';
	  		}).error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
		};
	}
	
		
});


app.controller('monitorController', function($scope,$http) {

	
});
app.controller('billingController', function($scope,$http) {

	
});
