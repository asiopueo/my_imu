var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var serialport = require('serialport');
var port = new serialport('/dev/ttyACM0',
	{
		baudRate: 115200,
	});


app.use('/', express.static('client'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
    
io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

port.on('data', function(data){
	console.log('Data: ', data.toString('utf8'));
	//var dataArray = data.toString('utf8').split(/, /);
	//console.log(dataArray[1]);
	// some modification:
	io.emit('imu_update', data.toString('utf8'));
});

