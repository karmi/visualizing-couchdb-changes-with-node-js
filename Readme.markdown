# Visualizing CouchDB Database Changes with Node.js and Sockets #

An experiment in basic real-time visualization of _CouchDB_ [`_changes` stream](http://guide.couchdb.org/draft/notifications.html)
with [_Node.js_](http://nodejs.org/) and [Socket.IO](http://socket.io/).

## Installation ##

Clone the repository and navigate into it:

    $ git clone git://github.com/karmi/visualizing-couchdb-changes-with-node-js.git couchdb-changes
    $ cd couchdb-changes

Initialize the submodules:

    $ git submodule update --init

Copy (and posibly edit) the configuration file

    $ cp config.example.json config.json

Start the _Node.js_ server:

    $ node server.js

Open the client [application](http://localhost:8000/) in browser

    $ open http://localhost:8000/

-----

[Karel Minarik](http://karmi.cz)
