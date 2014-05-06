# Reporter Spec

The reporter spec is based on the original [mocha](https://github.com/visionmedia/mocha/tree/master/lib/reporters) design but does not conform exactly and it has a stricter/more minimalistic set of properties.

## Events

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
