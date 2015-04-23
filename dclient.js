
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var minimist = require('minimist');
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
  console.log('message', m.toString(), rinfo);
})
