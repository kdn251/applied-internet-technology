const rev = require('./hoffy.js');

let s = "foo=bar\nbaz=qux\nquxx=corge";
rev.simpleINIParse(s); // {foo: 'bar', baz: 'qux', quxx: 'corge'}
