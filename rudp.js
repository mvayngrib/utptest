var rudp = require('rudp')
var dgram = require('dgram')
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

console.log('localPort:', localPort, 'remoteHost:', host, 'remotePort:', remotePort);
var s = dgram.createSocket('udp4')
s.bind(localPort);
var client = new rudp.Client(s, host, remotePort);

client.on('message', function(data, rinfo) {
  console.log(arguments)
})

s.on('listening', function() {
  client.send(new Buffer('hey there'))
})
