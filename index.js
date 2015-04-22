
var utp = require('utp');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2), {
  alias: {
    h: 'host',
    l: 'localport',
    r: 'remoteport'
  }
})

var DEFAULT_PORT = 25778
var host = args.host || '72.76.47.91';
var port = Number(args.localport || DEFAULT_PORT);
var remotePort = Number(args.remoteport || DEFAULT_PORT);
var closed = 0;
var onclose = function() {
  if (++closed === 2) process.exit(0);
};

utp.createServer(function(socket) {
  console.log('new connection');
  socket.write('hello from server');
  socket.on('end', function() {
    socket.end();
  });
  socket.on('close', onclose);
  socket.on('data', function(e) {
    console.log('Got data', e.toString());
  });
}).listen(port);

console.log('attempting to connect to', host + ':' + port);
var socket = utp.connect(remotePort, host);
socket.on('connect', function() {
  console.log('connected');
});

socket.on('close', onclose);
socket.on('data', function(e) {
  console.log('Got data', e.toString());
});

socket.write('hello from client');
socket.end();
