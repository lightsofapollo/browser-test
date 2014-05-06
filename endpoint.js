var koa = require('koa');
var socketio = require('socket.io');
var static = require('koa-static');
var app = koa();
var tap = require('./reporter/tap');

app.use(static(__dirname));

var server = app.listen(3000);
var io = socketio(server);

var test = io.of('/test');
test.on('connection', function(socket) {
  tap(socket, process.stdout);
});

