const http = require('http');
const url = require('url');

const server = http.createServer();
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log('this is an incoming request');
});

server.listen(8080);
