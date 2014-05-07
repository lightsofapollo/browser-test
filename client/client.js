/**
@module browser-test/client
*/

var exportError = require('./export_error');
var debug = require('debug');

function assert(truthy, message) {
  // cast value to boolean
  if (!truthy) throw new Error(message);
}


function endTest(context, test) {
  context.socket.emit('test end', test);
  context.test = null;
  context.state = 'suite';
}

/**
Primary client interface (exposed and instantiated as `window.browserTest`)

The client maintains an internal state (exposed via `.state`) that is strictly enforced.
For example you cannot do this:

```js
client.state === 'none';

// ENTER 'suite' state
client.createSuite(10);

// create enter suite state from 'suite' only none
client.createSuite(0); // throws an error about state transitions...
```

The intent is to use this module to instrument existing test frameworks (like mocha)

@constructor
@alias module:browser-test/client
@param {Object} config - options for client.
@param {String} config.fileName - test file name.
@param {Object} config.socket - socket to emit events unto.
*/
function Client(config) {
  if (!(this instanceof Client)) return new Client(config);
  for (var key in config) this[key] = config[key];
}

Client.prototype = {
  test: null,
  suite: null,
  fileName: null,
  state: 'none',

  /**
  Create a suite (there can only be one)

  1. enters the `'suite'` state.
  2. sets the `.suite`.
  3. emits the `started` event on the server.

  @param {Number} total of tests in this suite.
  @param {Date} [start=new Date()] start date of the suite.
  */
  createSuite: function(total, start) {
    assert(
      this.state === 'none',
      'cannot create multiple suites'
    );

    this.state = 'suite';
    this.suite = {
      total: total,
      filename: this.fileName,
      start: start || new Date(),
      finished: null,
      pending: 0,
      failed: 0,
      passed: 0
    };

    this.socket.emit('started', this.suite);
  },

  /**
  Emits the `test start` event and enter the 'test' state.

  @param {String} title of the test.
  @param {Date} [started=new Date()] start date of the test.
  */
  createTest: function(title, started) {
    assert(
      this.state === 'suite',
      'cannot create a test while in another suite or test'
    );

    this.state = 'test';
    this.test = {
      title: title,
      started: started,
      finished: null,
      error: null
    };

    this.socket.emit('test start', this.test);
  },

  /**
  Fail the current test emitting the `test end` event and sets internal state to 'suite`

  @param {Erorr} error associated with the test.
  @param {Date} [finished=new Date()] set the finished date of the current test.
  */
  failTest: function(error, finished) {
    assert(this.state === 'test', 'fail - not in a test');

    this.test.finished = finished || new Date();
    this.test.error = exportError(error);
    this.test.state = 'failed';
    this.suite.failed++;

    endTest(this, this.test);
  },

  /**
  Pass the current test emits the `test end` event and sets internal state to 'suite'.
  */
  passTest: function() {
    assert(this.state === 'test', 'pass - not in a test');

    this.test.state = 'passed';
    this.suite.passed++;
    endTest(this, this.test);
  },

  /**
  Mark the current test as pending emits the `test end` event and sets internal state to 'suite'.
  */
  pendingTest: function() {
    assert(this.state === 'test', 'pending - not in a test');
    this.test.state = 'pending';
    this.suite.pending++;

    endTest(this, this.test);
  },

  /**
  Finish the current suite emitting the `finished` event on the server.

  @param {Date} [finished=new Date()] ended date of the suite.
  */
  finishSuite: function(finished) {
    assert(
      this.state === 'suite',
      'cannot finish suite while in another test or before suite start'
    );

    this.suite.finished = finished || new Date();
    this.state = 'done';
    this.socket.emit('finished', this.suite);
  }
};

module.exports = Client;
