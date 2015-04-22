var utp = require('utp');
var host = process.argv[2] || '72.76.47.91';
var port = Number(process.argv[3] || 25667);
var closed = 0;
var onclose = function() {
  if (++closed === 2) process.exit(0);
};

utp.createServer(function(socket) {
  // socket.resume();
  console.log('new connection');
  socket.on('end', function() {
    socket.end();
  });
  socket.on('close', onclose);
}).listen(port);

console.log('attempting to connect to', host + ':' + port);
var socket = utp.connect(port, host);
socket.on('connect', function() {
  console.log('connected');
});

// socket.resume();
socket.on('close', onclose);
