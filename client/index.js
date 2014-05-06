var client = require('./client');
var qs = require('querystring');
var config = qs.parse(document.location.search);

function buildClient() {
  var queryParams = qs.parse(document.location.search);
  var config = {
    fileName: queryParams.test
  };

  if (!queryParams.url) {
    console.error('browser-test: url query param is not set');
    return client(config);
  }

  if (!window.io) {
    console.error('browser-test: `io` is not available on window... include socket.io');
    return client(config);
  }

  console.log('browser-test: enabled connecting to', queryParams.url);

  config.io = io(queryParams.url);
  return client(config);
}

module.exports = buildClient();
