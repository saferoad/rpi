var statistics = require('math-statistics');
var usonic = require('r-pi-usonic');

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
	
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	
	if (distance < 0) {
		process.stdout.write('Error: Measurement timeout.\n');
	} else {
		process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
	}
};

usonic.init(function(err){
	if(err) {
		console.log("Error: "+err);
	} else {
		init({
			echoPin: 15, //Echo pin
			triggerPin: 14, //Trigger pin
			timeout: 1000, //Measurement timeout in µs
			delay: 60, //Measurement delay in ms
			rate: 5 //Measurements per sample
		});
	}
});