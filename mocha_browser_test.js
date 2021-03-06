/**
 * @fileoverview mocha <> browser-test bindings.
 */
'use strict';

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'browser_test'], factory);
  } else if (typeof exports === 'object') {
    factory(exports, require('browser_test'));
  } else {
    factory((root.mochaBrowserTest = {}), root.browserTest);
  }
})(this, function(exports, browserTest) {
  /**
   * @param {Runner} runner mocha test runner.
   */
  exports.createReporter = function(runner) {
    runner.on('start', function(event) {
      browserTest.createSuite(this.total);
    });

    runner.on('test', function(event) {
      browserTest.createTest(event.fullTitle());
    });

    runner.on('pass', function(event) {
      browserTest.passTest();
    });

    runner.on('fail', function(event, error) {
      browserTest.failTest(error);
    });

    runner.on('pending', function(event) {
      browserTest.createTest(event.fullTitle());
      browserTest.pendingTest();
    });

    runner.on('end', function() {
      browserTest.finishSuite();
    });
  };
});
