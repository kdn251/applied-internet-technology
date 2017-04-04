/* jshint expr: true, maxlen: false */
var chai = require('chai');
var expect = chai.expect; 
var net = require('net');

Object.assign(global, require('../src/evenWarmer.js'));

require('mocha-sinon');

var socket;

function mockSocket() {
    
    socket = new net.Socket({});
    this.sinon.stub(socket, 'write', function(s) { 
        return s;
    });
    this.sinon.stub(socket, 'end', function(s) { 
        return s;
    
    });
}

describe('Request', function() {

    it('parses and http request header informationinto properties', function() {
        var s = 'GET /foo.html HTTP/1.1\r\n';
        s += 'Host: localhost:8080\r\n';
        s += 'Referer: http://bar.baz/qux.html\r\n';
        s += '\r\n';
        var req = new Request(s);
        expect(req.method).to.equal('GET');
        expect(req.path).to.equal('/foo.html');
        expect(req.headers).to.deep.equal({'Host': 'localhost:8080', 'Referer': 'http://bar.baz/qux.html'});
    });

    it('sets body if body is present in request', function() {
        var s = 'POST /foo/create HTTP/1.1\r\n';
        s += 'Host: localhost:8080\r\n';
        s += '\r\n';
        s += 'foo=bar&baz=qux';
        var req = new Request(s);
        expect(req.method).to.equal('POST');
        expect(req.path).to.equal('/foo/create');
        expect(req.headers).to.deep.equal({'Host': 'localhost:8080'});
        expect(req.body).to.equal('foo=bar&baz=qux');
    });

    it('returns a string reprsenting the request when toString is called', function() {
        var s = 'POST /foo/create HTTP/1.1\r\n';
        s += 'Host: localhost:8080\r\n';
        s += 'Referer: localhost:8080/referer.html\r\n';
        s += '\r\n';
        s += 'foo=bar&baz=qux';
        var req = new Request(s);
        expect(req.toString()).to.equal(s);
    });

    it('returns a string reprsenting the request when toString is called, still works with no body', function() {
        var s = 'POST /foo/create HTTP/1.1\r\n';
        s += 'Host: localhost:8080\r\n';
        s += 'Referer: localhost:8080/referer.html\r\n';
        s += '\r\n';
        var req = new Request(s);
        expect(req.toString()).to.equal(s);
    });
});

describe('Response', function() {

    beforeEach(mockSocket);

    it('can create a new 200 http response and turn it into a string', function() {
        var s = 'HTTP/1.1 200 OK\r\n';
        s += '\r\n';
        var res = new Response(socket);
        res.statusCode = 200;

        expect(res.toString()).to.equal(s);
    });

    it('can create a new 404 http response and turn it into a string', function() {
        var s = 'HTTP/1.1 404 Not Found\r\n';
        s += '\r\n';
        var res = new Response(socket);
        res.statusCode = 404;

        expect(res.toString()).to.equal(s);
    });

    it('can create a new 500 http response and turn it into a string', function() {
        var s = 'HTTP/1.1 500 Internal Server Error\r\n';
        s += '\r\n';
        var res = new Response(socket);
        res.statusCode = 500;

        expect(res.toString()).to.equal(s);
    });

    it('can set a header', function() {
        var res = new Response(socket);
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;

        expect(res.headers['Content-Type']).to.equal('text/plain');
    });

    it('turn headers and body into a string', function() {
        var s = 'HTTP/1.1 200 OK\r\n';
        s += 'Content-Type: text/plain\r\n';
        s += 'X-Foo: bar\r\n';
        s += '\r\n';
        s += 'some plain text';
        var res = new Response(socket);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Foo', 'bar');
        res.statusCode = 200;
        res.body = 'some plain text';

        expect(res.toString()).to.equal(s);
    });

    it('sets status and body... calls end once... when send is called', function() {
        var res = new Response(socket);
        res.send(200, 'foo');

        // may call write
        // expect(socket.write.callCount).to.equal(1);
        expect(socket.end.callCount).to.equal(1);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal('foo');
    });

    it('calls end once... when end is called', function() {
        var res = new Response(socket);
        res.end();

        expect(socket.end.callCount).to.equal(1);
    });

    it('can redirect with a statusCode', function() {
        var s = 'HTTP/1.1 302 Found\r\n';
        s += 'Location: http://foo.bar/baz\r\n';
        s += '\r\n';

        var res = new Response(socket);
        res.redirect(302, 'http://foo.bar/baz');

        expect(res.headers['Location']).to.equal('http://foo.bar/baz');
        expect(res.statusCode).to.equal(302);
        expect(res.toString()).to.equal(s);
        expect(socket.end.callCount).to.equal(1);
    });

    it('can redirect without a statusCode', function() {
        var s = 'HTTP/1.1 301 Moved Permanently\r\n';
        s += 'Location: http://baz.qux/corge\r\n';
        s += '\r\n';

        var res = new Response(socket);
        res.redirect('http://baz.qux/corge');

        expect(res.headers['Location']).to.equal('http://baz.qux/corge');
        expect(res.statusCode).to.equal(301);
        expect(res.toString()).to.equal(s);
        expect(socket.end.callCount).to.equal(1);
    });

    it('can write without ending', function() {
        var res = new Response(socket);
        res.write('foo');

        expect(socket.write.callCount).to.equal(1);
        expect(socket.end.callCount).to.equal(0);
    });

    it('can write headers without ending', function() {
        var res = new Response(socket);
        res.writeHead(200, 'foo');

        expect(res.statusCode).to.equal(200);
        expect(socket.write.callCount).to.equal(1);
        expect(socket.end.callCount).to.equal(0);
    });

});
