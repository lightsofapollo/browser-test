var EventEmitter = require('events').EventEmitter;

module.exports = function eventReader(socket) {
  var ee = new EventEmitter();
  socket.on('message', function(data) {
    if (!data.utf8Data) {
      console.error('Unexpected packet from websocket', data);
      return;
    }

    ee.emit.apply(ee, JSON.parse(data.utf8Data));
  });

  return ee;
};
