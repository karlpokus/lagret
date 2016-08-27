var test = require('tape'),
    db = require('./lagret')(['items']);

test('add', function(t){
  db.items.add({name: 'mike'});
  var data = db.items.fetch();

  t.equal(data.length, 1, '.add {}');

  t.end();
});
