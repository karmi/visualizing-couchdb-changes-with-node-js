var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs'),
    port    = 8000;


// -- Node.js Server
server = http.createServer(function(req, res){
  // res.send('hello world');
  res.writeHead(200, {'Content-Type': 'text/html'})

  fs.readFile(__dirname + '/index.html', function(err, data){
		if (err) return '404';
		res.write(data, 'utf8');
		res.end();
	});

})
server.listen(port);


// -- Setup Socket.IO
var io = io.listen(server);

io.on('connection', function(client){

	console.log('Client connected');

	client.broadcast('New client connected...');

  setInterval(function() { client.send('HEY!') }, 1000)

	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});

	client.on('disconnect', function(){
		console.log('Client disconnected');
	});

});

console.log('Server running at http://127.0.0.1:'+port+'/');
