require.paths.unshift('./lib/node-couchdb/lib/');

require('./config.json')

var http    = require('http'),
    url     = require('url'),
    io      = require('socket.io'),
    couchdb = require('couchdb')
    fs      = require('fs');

var client  = couchdb.createClient(config.couchdb.port, config.couchdb.host),
    db      = client.db(config.couchdb.db),
    stream  = db.changesStream(config.couchdb.options);

// -- Node.js Server
server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;

	switch (path) {
	  case '/':
	    res.writeHead(200, {'Content-Type': 'text/html'})
      fs.readFile(__dirname + '/index.html', function(err, data){
    		res.write(data, 'utf8');
    		res.end();
    	});
    	break;
    case '/config.json':
	    res.writeHead(200, {'Content-Type': 'text/javascript'})
      fs.readFile(__dirname + '/config.json', function(err, data){
    		res.write(data, 'utf8');
    		res.end();
    	});
    	break;
  };
})
server.listen(config.app.port, config.app.host);


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

console.log('Server running at http://'+config.app.host+':'+config.app.port+'/');
