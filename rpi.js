var fs = require('fs');
var usonic = require('r-pi-usonic');
var io = require('socket.io-client')("http://45.55.220.113");

var Gpio = null;
var socket = null;
var config = {};
var radar = null;
var led = null;

var light = false;

io.on('connect', function() {
	console.log("Connected!");

	usonic.init(function(err){
		if(err) {
			console.log("Error: "+err);
		} else {
			init();
		}
	});

	io.on("light.up", function(data) {
		console.log("light-up");
		
		if(!light) {

			led.writeSync(1);
			light = true;

			setTimeout(function() {
				light = false
				led.writeSync(0);
			}, 2000);
		}
	});
});

init = function(){
	Gpio = require('onoff').Gpio;
	led = new Gpio(4, 'out');
	radar = usonic.createSensor(2, 3, 1000);

	monitorRadar();
}

monitorRadar = function() {
	console.log("Monitoring...");
	setInterval(function() {
		var distance = radar();
		console.log(distance);
		if(distance > 0) {
			console.log(distance.toFixed(2)+"cm");
			if(distance > 0 && distance < 10) {
				io.emit("capture.car",{});
			}
		} else {
			console.log("timeout");
		}
	}, 100)
}
