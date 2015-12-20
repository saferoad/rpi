var Gpio = require('onoff').Gpio;

led = new Gpio(3, 'out');


setInterval(function() {
	led.writeSync(1)
	setTimeout(function() {
		led.writeSync(0)
	}, 500)
}, 1000);
