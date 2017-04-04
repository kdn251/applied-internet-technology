// fansite.js
// create your own fansite using your miniWeb framework
const App = require('./miniWeb.js');
const app = new App();

//add necessary paths to routes
app.get('/', function(req, res) {
  //display home page
  res.sendFile("/html/index.html");
});

//send stylesheet for web pages
app.get('/css/base.css', function(req, res){
  res.sendFile('/css/base.css');
});

//send Mr. Robot logo to socket
app.get('/img/mrrobotlogo.png', function(req, res){
  res.sendFile('/img/mrrobotlogo.png');
});

//send about page
app.get('/about', function(req, res) {
  //display about page
  res.sendFile("/html/about.html");
});

//send random page
app.get('/random', function(req, res) {
  //display about page
  res.sendFile("/html/random.html");
});

//send image 1 page
app.get('/image1.jpg', function(req, res) {
  //display about page
  res.sendFile("/html/image1.html");
});

//send image1.jpg to socket
app.get('/img/mrrobotimage1.jpg', function(req, res) {
  //display about page
  res.sendFile("/img/mrrobotimage1.jpg");
});

//send image 2 page
app.get('/image2.png', function(req, res) {
  res.sendFile("/html/image2.html");
});

//send image2.png to socket
app.get('/img/mrrobotimage2.png', function(req, res) {
  res.sendFile("/img/mrrobotimage2.png");
});

//send image 3 page
app.get('/image3.gif', function(req, res) {
  res.sendFile("/html/image3.html");
});

//send image3.gif to socket
app.get('/img/mrrobotimage3.gif', function(req, res) {
  res.sendFile("/img/mrrobotimage3.gif");
});

//send random gif based on random number appended to file name
app.get("/randomGif" + "", function(req, res) {
  const random = Math.floor(Math.random() * 8) + 1;
  const fileName = "/img/mrrobot" + random + ".gif";
  //display random gif from Mr. Robot
  res.sendFile(fileName);
});

//listen for activity
app.listen(8080, '127.0.0.1');
