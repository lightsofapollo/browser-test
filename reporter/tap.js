var format = require('util').format;

function tap(inputStream, outputStream) {
  // current test number (tap starts at 1 not zero)
  var nth = 1;

  inputStream.on('started', function tapStart(event) {
    outputStream.write(format(
      '%d..%d\n',
      1,
      event.total
    ));
  });

  inputStream.on('log', function(evt) {
    outputStream.write('# LOG: ' + evt.message + ' - ' + evt.stack + '\n');
  });

  inputStream.on('test end', function testEnd(event) {
    var state = event.state;
    var message;

    if (state === 'pending') {
      message = format(
        'ok %d %s # SKIP\n',
        nth,
        event.title
      );
    }

    if (state === 'passed') {
      message = format(
        'ok %d %s\n',
        nth,
        event.title
      );
    }

    if (state === 'failed') {
      message = format(
        'not ok %s %s\n\n%s\n\n',
        nth,
        event.title,
        // indent two levels so it looks less ugly!
        event.error.stack.replace(/^/gm, '  ')
      );
    }

    outputStream.write(message);
    nth++;
  });

  inputStream.on('finished', function testFinish(event) {
    outputStream.write(format(
      '# PASSED: %d\n' +
      '# PENDING: %d\n' +
      '# FAILED: %d\n',
      event.passed,
      event.pending,
      event.failed
    ));
  });
}

module.exports = tap;
