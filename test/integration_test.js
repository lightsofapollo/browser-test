var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');
var parser = require('tap-parser');
var spawn  = require('child_process').spawn;

suite('integration test', function() {
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

  // TODO: Output is picking up some addon junk?
  test.skip('log.html', function(done) {
    // XXX: Big ugly hack to strip the variants in the output
    function stripLocalhost(string) {
      return string.
        replace(/localhost:([0-9]+)/, '').
        replace(/url=(.*)/, '');
    }

    exec(
      __dirname + '/../bin/browser-test test/browser/log.html',
      function(err, stdout) {
        if (err) return done(err);
        assert.equal(
          stripLocalhost(fs.readFileSync(__dirname + '/browser/log_expected.txt', 'utf8').trim()),
          stripLocalhost(stdout.trim())
        );
        done();
      }
    );
  });
});
