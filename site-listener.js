var socket = require('socket.io-client')('http://localhost:8080');
var exec = require('child_process').execFile;

socket.on('connect', function() {
	console.log("Connected to server");
	socket.emit('rpi.init', {});
})

socket.on('git.pull', function(data) {
	exec('bash', ['./git-pull.sh'], {}, function(err, data) { 
		if (err instanceof Error)
	    	console.log(err);
	    console.log(data);
	});
})
