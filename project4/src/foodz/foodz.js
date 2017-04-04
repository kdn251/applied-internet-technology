// foodz.js
//import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname, "public");

//utilize public path
app.use(express.static(publicPath));

//set express as engine
app.set('view engine', 'hbs');

//utilize body parser
app.use(bodyParser.urlencoded({ extended: false}));

//middleware to print method, path, and call next middleware function
app.use(function(req, res, next) {
    console.log(req.method, req.path);
    next();
});

//initialize all meals to empty array
const allMeals = [];

//push initial three meals into all meals
allMeals.push({ name: "chocoramen", description: "ramen noodles in a chocolate almond milk broth", filterCategory: "breakfast" });
allMeals.push({ name: "lycheezy", description: "cheese pizza with lychee on top", filterCategory: "anytime" });
allMeals.push({ name: "crazy cookie", description: "a 1 foot diameter cookie", filterCategory: "dinner" });

app.get('/', function(req,res) {
    //initialize filter and selected meals
    let filtered = undefined;
    let selectedMeals = [];

    //check if filter was chosen
    if(req.query) {
        filtered = req.query.filterCategory;
        //if filter was chosen, filter meals
        for(let i = 0; i < allMeals.length; i++) {
            //if category of current meal matches filter add it to selected meals
            if(allMeals[i].filterCategory === filtered) {
                selectedMeals.push(allMeals[i]);
            }
        }
    }

    //if filter was chosen render filtered choices
    if(filtered) {
        res.render('home', { "meals": selectedMeals, "type": filtered });
    }
    //otherwise, render all meals
    else {
        res.render('home', { "meals": allMeals });
    }
});


app.post('/', function(req, res){
    //add new meal to all meals
    allMeals.push(req.body);
    //redirect to home page
    res.redirect('/');
});

//listen for activity
app.listen(8080);
