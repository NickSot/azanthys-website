const http = require('node:http');
const {handleRequest, clearStamps} = require('./modules/request_handler.js');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  setTimeout(() => {
    clearStamps();
  }, 1000 * 60 * 60 * 24);

	handleRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); 