require.paths.unshift('./lib/node-couchdb/lib/');

var http    = require('http'),
    io      = require('socket.io'),
    couchdb = require('couchdb')
    fs      = require('fs'),
    port    = 8000;

var client  = couchdb.createClient(5984, 'localhost'),
    db      = client.db('test'),
    stream  = db.changesStream({ include_docs:true });

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
  client.send(db)

  stream.addListener('data', function(change) {
    client.send(change)
  });

	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});

	client.on('disconnect', function(){
		console.log('Client disconnected');
	});

});

console.log('Server running at http://127.0.0.1:'+port+'/');
