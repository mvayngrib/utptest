
var utp = require('utp');
var minimist = require('minimist');
var loggy = require('./loggy');
var args = minimist(process.argv.slice(2), {
  alias: {
    h: 'host',
    l: 'localport',
    r: 'remoteport'
  }
})

var noop = function() {}
var DEFAULT_PORT = 25778
var host = args.host || '72.76.47.91';
var localPort = Number(args.localport || DEFAULT_PORT);
var remotePort = Number(args.remoteport || DEFAULT_PORT);
var closed = 0;
var onclose = function() {
  if (++closed === 2) process.exit(0);
};

function startServer(cb) {
  cb = cb || noop
  var server = utp.createServer(function(socket) {
    console.log('incoming connection from', socket.host + ':' + socket.port);
    remotePort = socket.port;
    host = socket.host;

    socket.on('close', onclose);
    // socket.on('data', function(e) {
      // console.log(e.slice(20).toString());
    // });

    socket.write('hello from server');
    cb();
  });

  server.listen(localPort);
}

function startClient(cb) {
  cb = cb || noop
  var cOpts = {
    port: remotePort,
    host: host,
    localPort: localPort
  };

  console.log('outgoing connection to', cOpts);
  var socket = utp.connect(cOpts);

  socket.on('connect', function() {
    console.log(this.socket.address());
    localPort = this.socket.address().port;
    socket.write('hello from client');
    cb();
  });

  socket.on('close', onclose);
  socket.on('data', function(e) {
    console.log(e.toString());
  });
  // socket.end();
}

startServer(startClient);
