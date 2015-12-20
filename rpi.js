var fs = require('fs');
var usonic = require('r-pi-usonic');

var Gpio = null;
var socket = null;
var config = {};
var radar = null;
var led = null;

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
	led = new Gpio(3, 'out');
	socket = require('socket.io-client')("http://45.55.220.113");
	radar = usonic.createSensor(23, 24, 1000);

	socket.on("light.up", function(data) {
		console.log("light-up");
		if(led.gpio.readSync() == 0) {
			led.gpio.writeSync(1);
			setTimeout(function() {
				led.gpio.writeSync(0);
			}, 2000);
		}
	});

	monitorRadar();
}

monitorRadar  = function() {
	setInterval(function() {
		var distance = radar();
		console.log(distance.toFixed(2)+"cm");
		if(distance > 0 && distance < 10) {
			socket.emit("capture.car",{});
		}
	}, 100)
}
