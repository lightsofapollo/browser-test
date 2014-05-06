function createSocket(url) {
  var ws = new WebSocket(url);
  var queue = [];
  var ready = false;

  ws.onopen = function() {
    queue.forEach(function(values) {
      realEmit.apply(this, values);
    });
    ready = true;
  };

  function realEmit(...emit) {
    ws.send(JSON.stringify(emit));
  }

  return {
    emit: function(...emit) {
      if (ready) {
        realEmit.apply(this, emit);
        this.emit = realEmit;
        return;
      }
      queue.push(emit);
    }
  };
}

module.exports = createSocket;
