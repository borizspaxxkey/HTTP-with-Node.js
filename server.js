const https = require('https');
const url = require('url');
const services = require('./services')
const textBody = require('body');        // TextBody
const jsonBody = require('body/json');  // Json Data
const formBody = require('body/form'); // Form Data
const anyBody = require('body/any');  //  not sure the format of our incoming data
const fs = require('fs');

const server = https.createServer({
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt')
});
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'GET' && parsedUrl.pathname === '/metadata') {
    const { id } = parsedUrl.query;
    const metadata = services.fetchImageMetadata(id);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    const serializedJSON = JSON.stringify(metadata);
    res.write(serializedJSON);
    res.end();
    console.log(req.headers);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
    jsonBody(req, res, (err, body) => {
      if (err) {
        console.log(err);
      } else {
        services.createUser(body.userName);
        res.end('This was served with https!');
      }
    });
  }
  else {
    res.writeHead(404, {
      'X-Powered-By': 'Node'
    });
    console.log('not forund url');
    res.statusCode = 404;
    res.setHeader('hello', 'world');
    res.setHeader('Content-Type', 'application/json')
    res.end();
  }

});

server.listen(443); 
