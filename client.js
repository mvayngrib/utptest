
var dgram = require('dgram');
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
var count = 0;
var onclose = function() {
  debugger;
  if (++closed === 2) process.exit(0);
};

function startServer(cb) {
  cb = cb || noop
  var server = utp.createServer(function(socket) {
    console.log('incoming connection from', socket.host + ':' + socket.port);
    remotePort = socket.port;
    host = socket.host;

    socket.on('close', onclose);
    socket.on('data', function(e) {
      console.log('received', e.slice(20).toString());
    });

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
    localPort = this.socket.address().port;
    socket.write('hello from client: ' + (count++));
    cb();
  });

  socket.on('close', onclose);
  socket.on('data', function(e) {
    console.log(e.toString());
  });

  // socket.end();
}

var create = dgram.createSocket;
dgram.createSocket = function() {
  var s = create.apply(this, arguments);
  ['bind', 'send', 'end'].forEach(function(method) {
    var orig = s[method];
    s[method] = function() {
      console.log(method, arguments[0].toString());
      return orig.apply(this, arguments);
    }
  })

  return s;
}

startClient(startServer);
