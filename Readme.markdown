# Visualizing CouchDB Database Changes with Node.js and Sockets #

An experiment in basic real-time visualization of _CouchDB_ [`_changes` stream](http://guide.couchdb.org/draft/notifications.html)
with [_Node.js_](http://nodejs.org/) and [Socket.IO](http://socket.io/).

![Screenshot Small](http://github.com/karmi/visualizing-couchdb-changes-with-node-js/raw/master/screenshot-small.png)

## Installation ##

Clone the repository and navigate into it:

    $ git clone git://github.com/karmi/visualizing-couchdb-changes-with-node-js.git couchdb-changes
    $ cd couchdb-changes

Initialize the submodules:

    $ git submodule update --init

Copy (and posibly edit) the configuration file <small>(it listens on <http://localhost:5984/test> by default)</small>:

    $ cp config.example.json config.json

Start the _Node.js_ server:

    $ node server.js

Open the client [application](http://localhost:8000/) in browser:

    $ open http://localhost:8000/

Now make some changes in the database and see them in you browser, instantly:

    $ curl -H 'Content-Type: application/json' -X POST http://localhost:5984/test -d '{"foo":"bar"}'

-----

[Karel Minarik](http://karmi.cz)
