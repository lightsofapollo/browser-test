/**
 * @fileoverview mocha <> browser-test bindings.
 */
'use strict';

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'browser-test'], factory);
  } else if (typeof exports === 'object') {
    factory(exports, require('browser-test'));
  } else {
    factory((root.mochaBrowserTest = {}), root.browserTest);
  }
})(this, function(exports, browserTest) {
  /**
   * @param {Runner} runner mocha test runner.
   */
  exports.createReporter = function(runner) {
    runner.on('start', function(event) {
      browserTest.createSuite(this.total, 'mocha.html');
    });

    runner.on('test', function(event) {
      browserTest.createTest(event.title);
    });

    runner.on('pass', function(event) {
      browserTest.passTest();
    });

    runner.on('fail', function(event, error) {
      browserTest.failTest(error);
    });

    runner.on('pending', function(event) {
      browserTest.createTest(event.title);
      browserTest.pendingTest();
    });

    runner.on('end', function() {
      browserTest.finishSuite();
    });
  };
});
