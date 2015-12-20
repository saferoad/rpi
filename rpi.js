var fs = require('fs');
var usonic = require('r-pi-usonic');

var Gpio = null;
var socket = null;
var config = {};
var radars = {};
var leds = {};

fs.readFile(__dirname+'/config.env', function(err, data){
	if(err) {
		throw err;
	}

	config = JSON.parse(data);
	usonic.init(function(err){
		if(err) {
			console.log("Error: "+err);
		} else {
			init();
		}
	});
});


init = function(){
	Gpio = require('onoff').Gpio;
	socket = require('socket.io-client')(config.server);

	var radarsData = {};
	var ledsData = {};

	for (var i in config.radars){
		radarsData[i] = {
			"index": i,
			"pos": config.radars[i].pos
		}

		radars[i] = radarsData[i];
		radars[i].carDistance = config.radars[i].carDistance;
		radars[i].timeout = config.radars[i].timeout;
		radars[i].sensor = usonic.createSensor(config.radars[i].echo, config.radars[i].trigger, config.radars[i].timeout);

	}

	for (var i in config.leds){
		ledsData[i] = {
			"index": i,
			"pos": config.leds[i].pos
		}
		
		leds[i] = ledsData[i];
		// leds[i].gpio = new Gpio(config.leds.pin, 'out');
	}
	

	// socket.emit("rpi.init", leds);
	
	socket.on("light.up", function(data) {
		var led = leds[data.index];
		// led.gpio.writeSync(1);
		// console.log("Lighting up #"+data.index);
		
		if(lightTimeouts[data.index]) {
			clearTimeout(lightTimeouts[data.index]);
			delete lightTimeouts[data.index];
		}
		
		lightTimeouts[data.index] = setTimeout(function() {
			// led.gpio.writeSync(0);
		}, 500);
	});

	startMonitoringDistances();
}

startMonitoringDistances = function() {
	for (var i in radars) {
		monitorRadar(radars[i]);
	}
}

monitorRadar  = function(radar) {
	
	console.log("Monitoring radar on position" + radar.pos)

	setInterval(function() {
		var distance = radar.sensor();
		console.log("Radar @"+radar.pos+" > "+distance);
		if (distance > 0 && distance < radar.carDistance) {
			socket.emit("capture.car", {
				"pos": radar.pos,
				"distance": distance 
			});
		}
	}, radar.timeout);
}




