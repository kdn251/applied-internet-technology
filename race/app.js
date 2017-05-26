var express = require('express');
var app = express();
app.use(express.static('public'));
//socket.io setup
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  //socket represents the connected client
  console.log(socket.id, "has connected");

  socket.on('greeting', (data) => {
    console.log(socket.id, 'sent', data);
  });
});

server.listen(3000);
