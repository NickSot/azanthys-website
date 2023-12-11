const http = require('node:http');
const handleRequest = require('./modules/request_handler.js');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
	handleRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); 