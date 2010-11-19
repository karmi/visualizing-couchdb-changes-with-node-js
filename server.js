require.paths.unshift('./lib/node-couchdb/lib/',
                      './lib/socket-io/lib/',
                      './lib/socket.io-node/lib/');

require('./config.json')

var http    = require('http'),
    url     = require('url'),
    io      = require('socket.io'),
    couchdb = require('couchdb'),
    sys     = require('sys'),
    fs      = require('fs');

var client  = couchdb.createClient(config.couchdb.port, config.couchdb.host),
    db      = client.db(config.couchdb.db);

// -- Connect to _changes and attach passed callback --------------------------

var attach_couchdb_changes_stream = function(callback) {
  var stream,
      since;

  db.info(function(err, data) {
    if (err) throw new Error(JSON.stringify(err));
    // Get 'update_seq' from database info and use it for 'since' param
    since = data.update_seq;
    stream = db.changesStream({since:since});
    console.log('db.update_seq: ' + since);

    // Attach callback for socket.io
    stream.addListener('data', callback);
  });

  return stream;
}


// -- Node.js Server ----------------------------------------------------------

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
    case '/bg.png':
	    res.writeHead(200, {'Content-Type': 'image/png'})
      fs.readFile(__dirname + '/bg.png', function(err, data){
    		res.write(data);
    		res.end();
    	});
    	break;
  };
})
server.listen(config.app.port, config.app.host);


// -- Setup Socket.IO ---------------------------------------------------------

var io = io.listen(server);

io.on('connection', function(client){
  // console.log('Client connected:', sys.inspect(client));

  // Send CouchDB connection info
  client.send(db)

  // Send CouchDB _changes
  attach_couchdb_changes_stream(function(change) {
    client.send(change)
  });

});

console.log('Server running at http://'+config.app.host+':'+config.app.port+'/');
