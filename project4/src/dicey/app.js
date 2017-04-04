const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const LENGTH_OF_WORD = 5;

//set  engine to handlebars
app.set('view engine', 'hbs');

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

//middleware to print method, path, and call next middleware function
app.use(function(req, res, next) {
  console.log(req.method, req.path);
  next();
});

//handle paths
app.get('/', function(req, res){
    //redirect / to generate page
    res.redirect('generate');
});

//handle about path
app.get('/about', function(req, res) {
    res.render('about');
});

//read in worst list file
const fileToString = fs.readFileSync('diceware.wordlist.txt').toString();
const allLines = fileToString.split("\n");
const map = {};

//place all number string pairs into map
for(let i = 0; i < allLines.length; i++) {
  const split = allLines[i].split("\t");
  map[parseInt(split[0])] = split[1];
}


const spacers = {
  "space" : " ",
  "star" : "*",
  "dash" : "-",
  "comma" : ",",
  "none" : ""
};
//handle generate path
app.get('/generate', function(req, res) {

    let totalWords = null;
    let spacer = "space";
    let passPhrase = '';
    const numberCombination = [];

    //set total words
    if(req.query) {
      totalWords = req.query.numWords;
    }
    //set spacer
    if(spacers.hasOwnProperty(req.query.glue)) {
      spacer = spacers[req.query.glue];
    }

    //generate pass phrase based on random numbers
    for(let i = 0; i < totalWords; i++) {
      let current = '';
      for(let j = 0; j < LENGTH_OF_WORD; j++) {
        current += Math.floor(Math.random() * 6) + 1;
      }
      numberCombination.push({number: current, word: map[current]});
      passPhrase += i === (parseInt(totalWords) - 1) ? map[current] : map[current] + spacer;
    }

    //render pass phrase
    res.render('generate', {'totalWords' : totalWords, 'spacer': spacer, 'numberCombination': numberCombination, 'passPhrase': passPhrase});

});

//listen for activity
app.listen(8080);
console.log('Started server on port 8080');
