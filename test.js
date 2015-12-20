socket = require('socket.io-client')("http://45.55.220.113");
socket.on('connect', function() {
	console.log("Connected!");
})