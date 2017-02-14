var rev = require('./hoffy.js');

// console.log('answer:', rev.prod(1, 2, 3, 4));
// console.log('even numbers:', rev.any([1, 3,]));
function createFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}
console.log(rev.maybe(createFullName)('Frederick', 'Functionstein')); // Frederick Functionstein
console.log(rev.maybe(createFullName)(null, 'Functionstein'));        // undefined
console.log(rev.maybe(createFullName)('Freddy', undefined));
