
var dgram = require('dgram');
var newSocket = require('./mksocket');
var socket = newSocket();
var minimist = require('minimist');
var count = 0;
var args = minimist(process.argv.slice(2), {
  alias: {
    h: 'host',
    l: 'localport',
    r: 'remoteport'
  }
})

var DEFAULT_PORT = 25778
var remoteHost = args.host || '72.76.47.91';
var localPort = Number(args.localport || DEFAULT_PORT);
var remotePort = Number(args.remoteport || DEFAULT_PORT);

var msg = new Buffer('hello from client');
socket.bind(localPort, function() {
  socket.send(msg, 0, msg.length, remotePort, remoteHost);
});

socket.on('message', function(m, rinfo) {
  console.log('got message', m.toString());
  m = new Buffer(m.toString() + (count++));
  socket.send(m, 0, m.length, remotePort, remoteHost);
})
