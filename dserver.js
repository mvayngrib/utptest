
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

var msg = new Buffer('hello from server');
socket.bind(localPort);
socket.on('message', function(m, rinfo) {
  var newSocket = dgram.createSocket('udp4');
  newSocket.bind(localPort, function() {
    newSocket.send(msg, 0, msg.length, remotePort, remoteHost);
  })

  newSocket.on('message', function(m, rinfo) {
    console.log('message on new socket', m.toString(), rinfo);
  })
})
