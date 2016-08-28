var ops = {
  fetch: function() {
    var str = localStorage.getItem(this._name),
        data = (str) ? JSON.parse(str) : [];
    return data;
  },
  save: function(data) {
    localStorage.setItem(this._name, JSON.stringify(data));
  },
  add: function(x) {
    var wat = Object.prototype.toString,
        data = this.fetch(),
        before = data.length,
        after;
    if (wat.call(x) === '[object Object]') {
      x = [x];
    }
    x.map(function(o){
      if (!o._id) {
        o._id = this.id();
      }
      return o;
    },this).forEach(function(o){
      data.push(o);
    });
    this.save(data);
    after = data.length;
    return {op: 'add', n: after - before};
  },
  remove: function(x) {
    var data = this.fetch(),
        before = data.length,
        after;
    if (typeof x === 'string') {
      x = [x];
    }
    data = data.filter(function(o){
      return x.indexOf(o._id) === -1;
    });
    this.save(data);
    after = data.length;
    return {op: 'remove', n: after - before};
  },
  update: function(x, y) {
    var wat = Object.prototype.toString,
        data = this.fetch(),
        n = data.length;
    if (typeof x === 'string') {
      x = [x];
    }
    if (wat.call(x) === '[object Array]' && wat.call(y) === '[object Object]') {
      data = data.map(function(o){
        if (x.indexOf(o._id) > -1) {
          for (var k in y) {
            o[k] = y[k];
          }
        }
        return o;
      });
      n = x.length;
    }
    if (wat.call(x) === '[object Object]' && !y) {
      data = data.map(function(o){
        for (var k in x) {
          o[k] = x[k];
        }
        return o;
      });
    }
    this.save(data);
    return {op: 'update', n: n};
  },
  drop: function() {
    localStorage.removeItem(this._name);
  },
  count: function() {
    return this.fetch().length;
  }
};

function id() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// dummy data for testing in node
if (typeof window === 'undefined') {
  var Storage = {},
      localStorage = {
        data: {},
        getItem: function(coll) {
          if (!this.data[coll]) {
            return null;
          } else {
            return this.data[coll];
          }
        },
        setItem: function(coll, data) {
          this.data[coll] = data;
        },
        removeItem: function(coll) {
          if (this.data[coll]) {
            delete this.data[coll];
          }          
        }
      };
}

module.exports = function(colls){
  if (!colls || colls.length === 0) {
    throw new Error('Must pass collections');
  }
  if (typeof Storage === "undefined") {
    throw new Error('LocalStorage unavailable');
  }
  var o = {
    id: id
  };
  colls.forEach(function(coll){
    o[coll] = {
      _name: coll
    };
    for (var k in ops) {
      o[coll][k] = ops[k].bind(o[coll]);
    }
    o[coll].id = id;
  });
  return o;
}
