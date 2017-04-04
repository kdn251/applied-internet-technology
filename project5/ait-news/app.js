//import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./db');
const mongoose = require('mongoose');
const Link = mongoose.model('Link');
const Comment = mongoose.model('Comment');
const path = require('path');
const session = require('express-session');
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(path.join(__dirname, 'public')));
//utilize public path
app.use(express.static(publicPath));

const sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

//set express as engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//utilize body parser
app.use(bodyParser.urlencoded({ extended: false}));

//render home page
app.get('/', function(req, res){
  Link.find({ }, function(err, links){
    //check if error has occurred
    if(err){
			console.log(err);
		}
    res.render('home', { links : links });
  });
});

//handle posting links
app.post('/postLink', function(req, res) {
  //create new link with url and title
  const newLink = new Link({
    url: req.body.url,
    title: req.body.title,
  });

  //save new link to database and redirect to home page
  newLink.save(function(err) {
    //check for error
    if(err) {
      console.log(err);
    }
    //redirect to home page
    else {
      res.redirect('/');
    }
  });
});

app.get('/:slug', function(req, res){
  Link.findOne({slug: req.params.slug}, function(err, link){
    if(req.session.lastComment !== undefined){
      res.render('comments', { link : link, lastComment: "(the last comment you made was: " + req.session.lastComment +")"});
    }
    else{
      res.render('comments', { link : link, lastComment: ""});
    }
  });
});

app.post('/postComment', function(req, res){
  //initialize new comment
  const newComment = new Comment({
    text: req.body.comment,
    user: req.body.name,
  });
  //save last comment
  req.session.lastComment = req.body.comment;

  //save new comment
  Link.findOneAndUpdate({ slug : req.body.slug }, { $push: { comments: { user : req.body.name, text : " says :" + req.body.comment } } }, function(err) {
    //check for error
    if(err){
      console.log(err);
    }
    else {
      res.redirect(req.body.slug);
    }
  });
});

//middleware to print method, path, and call next middleware function
app.use(function(req, res, next) {
    console.log(req.method, req.path);
    next();
});

//listen for activity on port 3000
app.listen(3000);
