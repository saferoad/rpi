var Gpio = require('onoff').Gpio,
var socket = require('socket.io-client')('http://192.168.0.104:8080');

led = new Gpio(5, 'out');

socket.on('connect', function() {
	console.log("Connected to server");

socket.on('led.update', function(data) {
	if(data.power) {
		led.writeSync(1)
	} else {
		led.writeSync(0)
	}
})