var exportError = require('./export_error');
var debug = require('debug');

function assert(truthy, message) {
  // cast value to boolean
  if (!truthy) throw new Error(message);
}

function queueEmits(io) {
  var emit = io.emit.bind(io);
  if (io.connected) return emit;

  var ready = false;
  var queue = [];

  io.once('connect', function() {
    var message;
    ready = true;
    while ((message = queue.shift())) emit.apply(io, message);
  });

  return function() {
    var args = Array.slice(arguments);
    if (ready) return emit.apply(io, args);
    queue.push(args);
  };
}

function client(config) {
  // check for the socket.io configuration
  var io = config && config.io;
  var emit;

  if (io) {
    emit = queueEmits(io);
  } else {
    emit = debug('browser-test:offline');
  }

  /**
  Possible states:

  Possible state transitions:
  none -> suite
  suite -> test
  test -> suite
  suite -> done

  [
    'none', // there is no suite
    'suite', // suite has been created
    'test', // in a test
    'done' // done
  ]

  */
  var currentState = 'none';
  var currentSuite = null; // current suite in the state machine
  var currentTest = null; // current test in the state machine

  function endTest(test) {
    emit('test end', test);
    currentTest = null;
    currentState = 'suite';
  }

  return {

    get test() {
      return currentTest;
    },

    get suite() {
      return currentSuite;
    },

    get state() {
      return currentState;
    },

    createSuite: function(total, filename, start) {
      assert(
        currentState === 'none',
        'cannot create multiple suites'
      );

      currentState = 'suite';
      currentSuite = {
        total: total,
        filename: filename,
        start: start || new Date(),
        finished: null,
        pending: 0,
        failed: 0,
        passed: 0
      };

      emit('started', currentSuite);
    },

    createTest: function(title, started) {
      assert(
        currentState === 'suite',
        'cannot create a test while in another suite or test'
      );

      currentState = 'test';
      currentTest = {
        title: title,
        started: started,
        finished: null,
        error: null
      };

      emit('test start', currentTest);
    },

    failTest: function(error, finished) {
      console.log(currentState, '<<<! state', error);
      assert(currentState === 'test', 'fail - not in a test');

      currentTest.finished = finished || new Date();
      currentTest.error = exportError(error);
      currentTest.state = 'failed';
      currentSuite.failed++;

      endTest(currentTest);
    },

    passTest: function() {
      assert(currentState === 'test', 'pass - not in a test');

      currentTest.state = 'passed';
      currentSuite.passed++;
      endTest(currentTest);
    },

    pendingTest: function() {
      assert(currentState === 'test', 'pending - not in a test');
      currentTest.state = 'pending';
      currentSuite.pending++;

      endTest(currentTest);
    },

    finishSuite: function(finished) {
      assert(
        currentState === 'suite',
        'cannot finish suite while in another test or before suite start'
      );

      currentSuite.finished = finished || new Date();
      currentState = 'done';
      emit('finished', currentSuite);
    }
  };
}

module.exports = client;
