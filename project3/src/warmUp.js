// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

const server = net.createServer((sock) => {
  // within create server
  sock.on('data', function() {
      sock.write("HTTP/1.1 200\r\nContent-Type: text/html\r\n\r\n <em>Hello</em> <strong>World</strong>");
      // uncomment me if you want the connection to close
      // immediately after we send back data
      sock.end();
  });
});

server.listen(PORT, HOST);
