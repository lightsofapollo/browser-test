var tap = require('./tap');
var Emitter = require('events').EventEmitter;

test('sanity of tap output', function(done) {
  console.log('\n');
  var events = new Emitter();
  tap(events, process.stdout);

  var started = new Date();
  events.emit('start', {
    total: 3,
    started: started
  });

  events.emit('test end', {
    state: 'pending',
    title: 'Pending test'
  });

  events.emit('test end', {
    state: 'failed',
    title: 'Failed test',
    error: new Error('bad shit happens all the time')
  });

  events.emit('test end', {
    state: 'passed',
    title: 'passed test'
  });

  setTimeout(function() {
    events.emit('finish', {
      started: started,
      finished: new Date(),
      total: 3,
      pending: 1,
      passed: 1,
      failed: 1
    });
    done();
  }, 10);
});
