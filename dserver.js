
var dgram = require('dgram');
var newSocket = require('./mksocket');
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

function respawn() {
  var socket = newSocket();
  socket.bind(localPort);
  socket.send(msg, 0, msg.length, remotePort, remoteHost);
  socket.on('message', function(m, rinfo) {
    console.log('message', m.toString(), rinfo);
    socket.close();
    setTimeout(respawn, 3000);

    // setTimeout(function() {
    //   var anotherSocket = newSocket();
    //   anotherSocket.bind(localPort, function() {
    //     anotherSocket.send(msg, 0, msg.length, remotePort, remoteHost);
    //   })

    //   anotherSocket.on('message', function(m, rinfo) {
    //     console.log('message on new socket', m.toString(), rinfo);
    //   })
    // }, 2000);
  });
}

respawn();
