var fs = require('fs');
var usonic = require('r-pi-usonic');
var io = require('socket.io-client')("http://45.55.220.113");

var Gpio = null;
var socket = null;
var config = {};
var radar = null;
var led = null;


io.on('connect', function(socket) {
	console.log("Connected!");


	io.on("light.up", function(data) {
		console.log("light-up");
		if(led.gpio.readSync() == 0) {
			led.gpio.writeSync(1);
			setTimeout(function() {
				led.gpio.writeSync(0);
			}, 2000);
		}
	});
});

init = function(){
	Gpio = require('onoff').Gpio;
	led = new Gpio(2, 'out');
	radar = usonic.createSensor(3, 4, 1000);

	monitorRadar();
}

monitorRadar  = function() {
	console.log("Monitoring...");
	setInterval(function() {
		var distance = radar();
		if(distance > 0) {
			console.log(distance.toFixed(2)+"cm");
			if(distance > 0 && distance < 10) {
				socket.emit("capture.car",{});
			}
		} else {
			console.log("timeout");
		}
	}, 100)
}
