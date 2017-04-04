// reversi.js

const rev = {

  //return the product of all numbers
  prod: function(...numbers) {

    if(numbers.length === 0) {

      return undefined;

    }

    const answer = numbers.reduce(function(product, currentNumber ){
      return product * currentNumber;
    }, 1);

    return answer;

  },

  //check if there exist any even numbers in arr
  any: function(arr, fn) {

    const passedTest = arr.filter(fn);

    return passedTest.length > 0 ? true : false;

  },

  //check if undefined or null value exists and call function accordingly
  maybe: function(fn1) {

    return function(fn) {

      const array = [...arguments];

      if(array.indexOf(undefined) > -1 || array.indexOf(null) > -1) {

        return undefined;

      }

      else {

        return fn1(...array);

      }

    };

  },

  constrainDecorator: function(fn, min, max) {

    return function() {

      if(fn.apply(this, arguments) < min) {

        return min;

      }

      else if(fn.apply(this, arguments) > max) {

        return max;

      }

      else {

        return fn.apply(this, arguments);

      }

    };

  },

  limitCallsDecorator: function(fn, n) {

    let count = 0;

    return function() {

      if(count < n) {

        count++;
        return fn.apply(this, arguments);

      }

      else {

        return undefined;

      }

    };

  },

  mapWith: function(fn) {

    return function(newFunction) {

      return Array.prototype.map.call(newFunction, function(current) {

        return fn.call(this, current);

      });

    };

  },


  simpleINIParse: function(s) {
    //USE REDUCE
    const split = s.split('\n');
    const map = {};
    rev.splitRecursive(0, split, map);
    return map;

  },

  //recursively split current element in split array and add the key and value to map
  splitRecursive: function(index, split, map) {

    //return when we have iterated through each element of the array
    if(index === split.length) {

      return;

    }

    //if the current element does not contains an equal sign continue
    if(split[index].indexOf('=') < 0) {

      //continue;

    }

    //otherwise place key and value into map
    else {

      let key = split[index].split('=')[0];
      let value = split[index].split('=')[1];

      if(key === undefined || key === null) {

        key = "";

      }

      if(value === undefined || value === null) {

        value = "";

      }

      map[key] = value;

    }

    index++;

    rev.splitRecursive(index, split, map);

  },

  readFileWith: function(fn) {

    const fs = require('fs');

    return function(fileName, callback) {

      let parsed = {};
      fs.readFile(fileName, 'utf8', function(err, data) {

        if(data) {

          parsed = fn(data);
          callback(err, parsed);

        }

        else {

          callback(err, undefined);

        }

      });


    };

  }

};

module.exports = rev;
