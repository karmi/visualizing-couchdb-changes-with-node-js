require.paths.unshift('./lib/node-couchdb/lib/');

require('./config.json')

var http    = require('http'),
    url     = require('url'),
    io      = require('socket.io'),
    couchdb = require('couchdb'),
    fs      = require('fs');

var client  = couchdb.createClient(config.couchdb.port, config.couchdb.host),
    db      = client.db(config.couchdb.db),
    stream,
    since   = 0;

var stream_x = function() {
  db.info(function(err, data) {
      if (err) throw new Error(JSON.stringify(err));
      since = data.update_seq;
      console.log('db.update_seq: ' + since);
      // Get update_seq from db info and use it for 'since' param
      stream  = db.changesStream({since:since});
  });
  return stream;
}


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

  try {
    stream_x().addListener('data', function(change) {
      client.send(change)
    });
  } catch(e) {
    console.error(e);
  }

	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});

	client.on('disconnect', function(){
		console.log('Client disconnected');
	});

});

console.log('Server running at http://'+config.app.host+':'+config.app.port+'/');
