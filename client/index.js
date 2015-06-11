var client = require('./client');
var createLogger = require('./console');
var createSocket = require('./socket');
var qs = require('querystring');

function buildClient() {
  var search = decodeURIComponent(document.location.search);
  if (search.charAt(0) === '?') {
    search = search.substring(1);
  }

  var queryParams = qs.parse(search);
  var config = { fileName: queryParams.test };

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
