# Reporters

The reporter spec is based on the original [mocha](https://github.com/visionmedia/mocha/tree/master/lib/reporters) design but does not conform exactly and it has a stricter/more minimalistic set of properties.

## Interface

```js
// a quick example of a reporter module the intent is that these should
// be pluggable.

/**
@param {EventEmitter} incoming - events from the browser
@param {WritableStream} output - suitable for stdout and the like
*/
function createReporter(incoming, output) {
  incoming.once('started', function(event) {
    output.write('No meaningful output for your foo!\n');
  });

  incoming.once('finished', function(event) {
    output.write('I am done!\n');
  });
}

module.exports = createReporter;

```

## Events

These events are emitted by the first argument to the reporter (the
incoming data)

### `started`

```js
/**
@typedef StartedEvent
@type {Object}
@property {Date} started - start time of the test suite
@property {Number} total - total number of tests
@property {String} filename - path to your file.
@example

  {
    started: new Date(),
    total: 10,
    filename: 'path/to/test_file.js'
  }
*/
```

### `test start`

```js
@typedef TestStartEvent
@type {Object}
@property {String} title - of the test
@property {Date} started - start time of the test
```

### `test end`

```js
@typedef TestEndEvent
@type {Object}
@property {String} title - of the test
@property {String} state - One of ['passed', 'failed', 'pending']
@property {Error} [error] - Error object in the case of state ===
'fail'
```

### `finished`

```js
@typedef FinishedEvent
@type {Object}
@property {Date} started - time of the suite.
@property {Date} finished - end time of the suite.
@property {Number} total - number of tests.
@property {Number} passed - number of passed tests.
@proeprty {Number} failed - number of failed tests.
@property {Number} pending - number of pending tests.
@property {String} filename - of the test suite.
@example

  {
    started: new Date(),
    finished: new Date(),
    total: 10,
    passed: 10,
    failed: 0,
    pending: 0,
    filename: 'path/xfoo/bar.js'
  }

```
