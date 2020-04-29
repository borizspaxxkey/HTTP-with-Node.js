const http = require('http');
const url = require('url');
const services = require('./services')
const textBody = require('body');        // TextBody
const jsonBody = require('body/json');  // Json Data
const formBody = require('body/form'); // Form Data
const anyBody = require('body/any');  //  not sure the format of our incoming data
const fs = require('fs');            // Reading File Stream
const formidable = require('formidable');  // For file Uploading

const server = http.createServer({
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
        console.log(body)
        services.createUser(body.userName);
        res.end('This was served with https!');
      }
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/upload') {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024, // size in bytes
      encoding: 'utf-8',
      maxFields: 20
    });
    form.parse(req)
      .on('fileBegin', (name, file) => {
        console.log('Our upload has started!');
      })
      .on('file', (name, file) => {
        console.log('Field + file pair has been received');
      })
      .on('field', (name, value) => {
        console.log('Field received:');
        console.log(name, value);
      })
      .on('progress', (bytesReceived, bytesExpected) => {
        console.log(bytesReceived + ' / ' + bytesExpected); // to send progress of upload to the user
      })
      .on('error', (err) => {
        console.log(err);
        req.resume();  // to continue the lifecycle of it
      })
      .on('aborted', () => { // emmited when the request is aborted by the user
        console.error('request aborted by the user!');
      })
      .on('end', () => {
        console.log('Done - request fully received');
        res.end('Success');
      });
  }
  else {
    fs.createReadStream('./index.html').pipe(res);
    // res.writeHead(404, {
    //   'X-Powered-By': 'Node'
    // });
    // console.log('not forund url');
    // res.statusCode = 404;
    // res.setHeader('hello', 'world');
    // res.setHeader('Content-Type', 'application/json')
    // res.end();
  }

});

server.listen(8080); 
