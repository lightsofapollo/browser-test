var exportError = require('./export_error');
var inspect = require('./inspect');

var TYPES = ['log', 'error', 'info'];
var stackPosition = /\(([^()]+)\)/gm;

function stackTrace() {
  var e = exportError(new Error());
  return e.stack.split('\n').map(function(item) {
    var match = item.trim().match(stackPosition);
    return match && match.pop();
  });
}

function overloadConsole(socket) {
  TYPES.forEach(function(type) {
    var original = console[type];

    console[type] = function(...args) {
      var stack = stackTrace()[3];
      var message = inspect.format.apply(inspect, args);
      original.apply(console, args);
      socket.emit('log', { message: message, stack: stack });
    };
  });
}

module.exports = overloadConsole;
