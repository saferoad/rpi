var statistics = require('math-statistics');
var usonic = require('r-pi-usonic');

var Gpio = require('onoff').Gpio;

led = new Gpio(17, 'out');

var init = function(config) {

	var sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);

	(function measure() {

		print(sensor());

		setTimeout(function() {
			measure();
		}, config.delay);
	}());
};

var print = function(distance) {
	
	if (distance < 0) {
		process.stdout.write('Error: Measurement timeout.\n--\n');
		led.writeSync(0)
	} else {
		process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
		if(distance.toFixed(2) < 10) {
			led.writeSync(1)
		} else {
			led.writeSync(0)
		}
	}
};

usonic.init(function(err){
	if(err) {
		console.log("Error: "+err);
	} else {
		init({
			echoPin: 23, //Echo pin
			triggerPin: 14, //Trigger pin
			timeout: 1000, //Measurement timeout in µs
			delay: 100, //Measurement delay in ms
			rate: 5 //Measurements per sample
		});
	}
});