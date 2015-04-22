var utp = require('utp');
var host = process.argv[2];
var closed = 0;
var onclose = function() {
  if (++closed === 2) process.exit(0);
};

utp.createServer(function(socket) {
  // socket.resume();
  socket.on('end', function() {
    socket.end();
  });
  socket.on('close', onclose);
}).listen(12345);

var socket = utp.connect(12345, host || '72.76.47.91');

// socket.resume();
socket.on('close', onclose);
