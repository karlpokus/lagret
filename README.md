# lagret
Persistant db.json on the client. The classic array of objects. Uses localstorage. Modelled on the mongoDB API. Values behave like you would expect from the json API. Unique id:s are created if none are passed. Optionally create your own by the helper `.id()` or by other means. Always use `_id` for the key and make them strings. `.add`, `.remove` and `.update` return an object with the operation specified and records affected.

# install
```
$ npm i lagret
```

# usage
```javascript
// init by passing an array of collections
var db = require('lagret')(['items', 'users']);
// fetch
var data = db.users.fetch();
// add one by passing an object. Pass array to add many.
var added = db.users.add({name: 'Mike', age: 23});
// remove one by passing an id. Pass array to remove many
var removed = db.users.remove('ytGhgds67hsk');
// update one by passing an id and an object with data. Pass array to update many. Pass only an object with data to update all records
var updated = db.users.update('hvV3v&82nnd', {human: false});
// erase all data
db.users.drop();
// return number of records
var n = db.users.count();
```

TODOs
- npm
- continue testing
- sort?
- optional cb?
- update by regex

# Licence
MIT
