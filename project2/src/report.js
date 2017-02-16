const fs = require('fs');
const request = require('request');
const processGameData = require('./basketfunc.js');

const rev = {

  getData: function(callback) {

    let parsed = {};

    request('http://foureyes.github.io/csci-ua.0480-spring2017-008/homework/02/0021600680_gamedetail.json', function (error, response, body) {
      if (!error && response.statusCode === 200) {

          if(body) {

            parsed = JSON.parse(body);
            callback(parsed);

          }

          else {

            console.log('not good...');

          }
      }

    });

    // fs.readFile('./../tests/0021600681_gamedetail.json', 'utf8', function(err, data) {
    //
    //   if(data) {
    //
    //     parsed = JSON.parse(data);
    //     callback(parsed);
    //
    //   }
    //
    //   else {
    //
    //     console.log('not good...');
    //
    //   }
    //
    // });

  }

};

//module.exports = rev;

rev.getData(function(parsed){


  processGameData(parsed.g);
  //console.log(data);




});
