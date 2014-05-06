var client = require('./client');
var qs = require('querystring');
var config = qs.parse(document.location.search);

function buildClient() {
  var config = qs.parse(document.location.search);

  if (!config.url) {
    console.error('browser-test: url query param is not set');
    return client();
  }

  if (!window.io) {
    console.error('browser-test: `io` is not available on window... include socket.io');
    return client();
  }

  console.log('browser-test: enabled connecting to', config.url);

  return client({
    io: io(config.url)
  });
}

module.exports = buildClient();
