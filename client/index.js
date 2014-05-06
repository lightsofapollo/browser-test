var client = require('./client');
var createSocket = require('./socket');
var createLogger = require('./console');

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

  console.log('browser-test: enabled connecting to', queryParams.url);
  var socket = createSocket(queryParams.url);

  createLogger(socket);

  config.socket = socket;
  return client(config);
}

module.exports = buildClient();
