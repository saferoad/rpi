var Gpio = require('onoff').Gpio;
var socket = require('socket.io-client')('http://192.168.0.104:8080');

led = new Gpio(5, 'out');

socket.on('connect', function() {
	console.log("Connected to server");
	socket.emit('led.init', {});
})

socket.on('led.update', function(data) {
	if(data.power) {
		console.log("Turning led ON");
		led.writeSync(1)
	} else {
		console.log("Turning led OFF");
		led.writeSync(0)
	}
})
