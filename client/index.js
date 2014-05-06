var client = require('./client');
var createSocket = require('./socket');

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

  config.socket = createSocket(queryParams.url);
  return client(config);
}

module.exports = buildClient();
