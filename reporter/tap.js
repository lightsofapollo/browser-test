var diff = require('diff');
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

      // Logic mostly lifted from mocha
      if ('actual' in event.error &&
          'expected' in event.error &&
          event.error.showDiff !== false) {
        var actual = event.error.actual;
        var expected = event.error.expected;
        var toString = Object.prototype.toString;
        // Check that things are same type
        if (toString.call(actual) === toString.call(expected)) {
          event.error.actual = JSON.stringify(event.error.actual);
          event.error.expected = JSON.stringify(event.error.expected);
          message = format(
            '%s%s',
            message,
            unifiedDiff(event.error)
          );
        }
      }
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

/**
 * Returns a unified diff between two strings.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @return {string} The diff.
 */
function unifiedDiff(err) {
  var indent = '      ';
  function cleanUp(line) {
    if (line[0] === '+') {
      return indent + colorLines('diff added', line);
    }
    if (line[0] === '-') {
      return indent + colorLines('diff removed', line);
    }
    if (line.match(/\@\@/)) {
      return null;
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return indent + line;
  }
  function notBlank(line) {
    return line != null;
  }
  var msg = diff.createPatch('string', err.actual, err.expected);
  var lines = msg.split('\n').splice(4);
  return '\n      '
    + colorLines('diff added', '+ expected') + ' '
    + colorLines('diff removed', '- actual')
    + '\n\n'
    + lines.map(cleanUp).filter(notBlank).join('\n');
}

/**
 * Color lines for `str`, using the color `name`.
 *
 * @api private
 * @param {string} name
 * @param {string} str
 * @return {string}
 */
function colorLines(name, str) {
  return str.split('\n').map(function(str) {
    return color(name, str);
  }).join('\n');
}

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {string} type
 * @param {string} str
 * @return {string}
 * @api private
 */
function color(type, str) {
  // No colors for now.
  return String(str);
};

module.exports = tap;
