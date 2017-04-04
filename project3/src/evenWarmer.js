// evenWarmer.js
// create Request and Response constructors...
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

function Request(httpRequest) {
  //split httpRequest
  httpRequest += "";
  const split = httpRequest.split("\r\n");
  const request = split[0];
  const headers = split[1];
  const body = split[3];

  //split request line
  this.path = request.split(" ")[1];
  this.method = request.split(" ")[0];

  //split headers line and assign headers accordingly
  const headerSplit = headers.split(" ");
  if(split[2]) {
    this.headers = {
      "Host": headers.split(" ")[1],
      "Referer": split[2].split(" ")[1]
    };
  }
  else {
    this.headers = {
      "Host": headerSplit[1]
    };
  }

  //set body
  this.body = body;

  //initialize toString property
  this.toString = function() {
    return httpRequest;
  };

}

function Response(socket) {
  //initialize status codes
  const codes = {
    "200": "OK",
    "404": "Not Found",
    "500": "Internal Server Error",
    "400": "Bad Request",
    "301": "Moved Permanently",
    "302": "Found",
    "303": "See Other"
  };

  //initialize properties
  this.headers = null;
  this.sock = socket;
  this.body = socket.body;
  this.statusCode = Number(socket.statusCode);

  //add header
  this.setHeader = function(name, value) {
    if(this.headers === null) {
      this.headers = {};
    }
    this.headers[name] = value;
  };

  //write to socket
  this.write = function(data) {
    this.sock.write(data);
  };

  //end socket
  this.end = function(s) {
    this.sock.end(s);
  };

  //send data
  this.send = function(statusCode, body) {

    //initialize to return
    let toReturn = "HTTP/1.1";

    //initialize status code and body
    this.statusCode = statusCode;
    this.body = body;

    //append status code
    toReturn += " " + statusCode + " OK\r\n";

    //add all headers to return value
    for(let i in this.headers) {
      toReturn += i + ": " + this.headers[i] + "OK \r\n\r\n";
    }

    //add body to return value
    toReturn += this.body;

    //end connection
    this.end(toReturn);
  };

  this.writeHead = function(statusCode) {
    this.statusCode = statusCode;
  };

  //handle redirects
  this.redirect = function(statusCode, url) {
    //check if status code exists
    if(isNaN(statusCode)) {
      this.setHeader("Location", statusCode);
      this.statusCode = 301;
    }
    //otherwise...
    else {
      this.statusCode = 301;
      this.statusCode = Number(statusCode);
      this.setHeader("Location", url);
    }
    this.end(this.statusCode, this.url);
  };

  //convert to String
  this.toString = function() {
    let s = 'HTTP/1.1 ' + this.statusCode + ' ' + codes[this.statusCode] + '\r\n';
    if(this.headers !== null) {
      for(const i in this.headers) {
        console.log("currentHeader: " + this.headers[i]);
        s += i + ": " + this.headers[i] + "\r\n";
      }
      s += "\r\n";
    }
    else {
      s += '\r\n';
    }

    if(this.headers !== null && this.body !== null) {
      s += this.body;
    }

    //check for undefined and remove it if necessary
    if(s.indexOf(undefined) > 0) {
      return s.slice(0, s.indexOf(undefined));
    }
    else {
      return s;
    }
  };

  this.handleRead = function(contentType, err, data) {
    //set header of content type
    this.setHeader("Content-Type", contentType);
    //write everything but body
    this.writeHead(200);
    //write data from file to the socket
    this.write(data);
    //close socket
    this.end();
  };

  this.sendFile = function(fileName) {
    //initialize extensions
    const extensions = {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "html": "text/html",
      "css": "text/css",
      "txt": "text/plain"
    };

    //require fs
    const fs = require('fs');

    //determine absolute path of file
    const publicRoot = __dirname + '/../public';
    const filePath = publicRoot + fileName;

    //determine extension of file
    const fileExtension = filePath.split(".")[1];
    this.contentType = extensions[fileExtension];

    //read file based on file extension
    if(fileExtension === "txt") {
      fs.readFile(filePath, {encoding:'utf8'}, this.handleRead.bind(this, this.contentType));
    }
    else {
      fs.readFile(filePath, {}, this.handleRead.bind(this, this.contentType));
    }
  };
}

const server = net.createServer((sock) => {
  // within create server
  sock.on('data', (createRequest) => {
    const request = new Request(createRequest);
    const response = new Response(sock);
    //handle paths
    if(request.path === "/") {
      response.setHeader("Content-Type:", "text/html");
      response.send(200, "this is a red header!");
    }
    else if(request.path === "/foo.css") {
      response.setHeader("Content-Type:", "text/html");
      response.send(200, "<h2 style='color: red'> this is a red header </h2>");
    }
    else if(request.path === "/test") {
      response.sendFile("/html/test.html");
    }
    else if(request.path === "/img/bmo1.gif") {
      response.sendFile("/img/bmo1.gif");
    }
    else {
      response.setHeader("Content-Type:", "text/html");
      response.send(404, "uh oh... 404 page not found!");
    }
  });
});

//listen for activity
server.listen(PORT, HOST);

//export Request and Response
module.exports = {
    Request: Request,
    Response: Response,
};
