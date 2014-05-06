suite('mocha js test', function() {
  test('woot', function() {
    console.log('the woot?', {
      yes: true,
      array: [1, 2, '3'],
      obj: { yep: true }
    });
  });

  test('fail', function() {
    throw new Error('epic fail');
  });
});
