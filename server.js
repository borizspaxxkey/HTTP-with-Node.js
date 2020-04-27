const http = require('http');

const server = http.createServer();
server.on('request', (req, res) => {
  console.log('this is an incoming request');
});

server.listen(8080);
