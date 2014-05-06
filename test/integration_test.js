suite('integration test', function() {
  var assert = require('assert');
  var parser = require('tap-parser');
  var spawn  = require('child_process').spawn;

  function verify(flags, tapOutput, exitCode, done) {
    var proc = spawn(
      __dirname + '/../bin/browser-test',
      flags
    );

    var tapObject;
    var stream = parser(function(result) {
      tapObject = result;
    });

    proc.stdout.pipe(stream);

    proc.once('exit', function(code) {
      try {
        var expected = require('./browser/' + tapOutput + '_expected.json');
        assert.equal(code, exitCode);
        assert.deepEqual(expected, tapObject);
        done()
      } catch(e) {
        done(e);
      }
    });
  }

  test('success.html',function (done) {
    verify(
      ['test/browser/success.html'],
      'success',
      0,
      done
    );
  });

  test('pending.html',function (done) {
    verify(
      ['test/browser/pending.html'],
      'pending',
      0,
      done
    );
  });

  test('fail.html',function (done) {
    verify(
      ['test/browser/fail.html'],
      'fail',
      1,
      done
    );
  });

  test('entrypoint.html',function (done) {
    verify(
      [
        '--entrypoint', 'test/browser/entrypoint.html',
        'test/browser/js_test.js'
      ],
      'entrypoint',
      1,
      done
    );
  });
});
