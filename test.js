var test = require('tape'),
    db = require('./lagret')(['items', 'users']);

// browserify
// X fetch
// X add
// X remove
// X update one
// update many
// update all
// count
// drop
// returned.n === 0 when no arg is passed? Is passing none allowed?
// set db.fetch, db.add etc to throw 'no such fn - use db.collection.fetch'?

test('init', function(t){
  var noArgs = function() {
        require('./lagret')();
      };

  t.throws(noArgs, 'throws on no args');
  var fnList = ['fetch', 'save', 'add', 'remove', 'update', 'drop', 'count'],
      addedFns = fnList
        .filter(function(fn){
          return typeof db.items[fn] === 'function' &&
            typeof db.users[fn] === 'function';
        });
  t.equal(fnList.length, addedFns.length, 'each collection has all functions');
  t.end();
});

test('fetch', function(t){
  var data = db.users.fetch();
  t.equal(data.length, 0, 'always returns an array');
  t.end();
});

test('add', function(t){
  var addOne = db.users.add({name: 'mike'})
      addMany = db.users.add([{name: 'julie'}, {name: 'john'}]),
      data = db.users.fetch(),
      recordsWithIds = data.filter(function(o){
        return typeof o._id === 'string';
      }).length;

  t.equal(addOne.n === 1 && addMany.n === 2, true, 'returns records affected');
  t.equal(data.length, 3, 'adds one or multiple records');
  t.equal(recordsWithIds, data.length, 'adds ids if none are passed');
  t.end();
});

test('remove', function(t){
  var ids = db.users.fetch().map(function(o){
        return o._id;
      }),
      removeOne = db.users.remove(ids[0]),
      removeMany = db.users.remove(ids),
      data = db.users.fetch();

  t.equal(removeOne.n === -1 && removeMany.n === -2, true, 'returns records affected');
  t.equal(data.length, 0, 'removes one or multiple records');
  t.end();
});

test('update', function(t){
  db.users.add({name: 'tom'});
  var id = db.users.fetch().map(function(o){
        return o._id;
      }),
      updateOne = db.users.update(id, {name: 'sarah'});

  t.equal(updateOne.n === 1, true, 'returns records affected');
  t.end();
});
