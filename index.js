
var utp = require('utp');
var minimist = require('minimist');
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

function server(cb) {
  cb = cb || noop
  utp.createServer(function(socket) {
    console.log('incoming connection from', socket.host, socket.port);
    remotePort = socket.port;
    host = socket.host;

    socket.on('close', onclose);
    socket.on('data', function(e) {
      console.log(e.toString());
    });

    socket.write('hello from server');
    cb();
  }).listen(localPort);
}

function client(cb) {
  cb = cb || noop
  var cOpts = {
    port: remotePort,
    host: host
    // ,
    // localPort: localPort
  };

  console.log('outgoing connection to', cOpts);
  var socket = utp.connect(cOpts);

  socket.on('connect', function() {
    localPort = this.socket.address().port;
    cb();
  });
  socket.on('close', onclose);
  socket.on('data', function(e) {
    console.log(e.toString());
  });

  socket.write('hello from client');
  // socket.end();
}

client(server);
