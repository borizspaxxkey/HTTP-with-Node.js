const https = require('https');

const data = JSON.stringify({
  userName: 'fred'
});

const options = {
  hostname: 'localhost',
  port: 443,
  path: '/users',
  method: 'POST', // PUT, DELETE
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': Buffer.from('myUsername' + ':' + 'myPassword').toString('base64')
  }
};

const request = https.request(
  options,
  (response) => {
    console.log(`statusCode: ${response.statusCode}`);
    console.log(response.headers);

    response.on('data', (chunk) => {
      console.log('This is a chunk: \n');
      console.log(chunk.toString());

    });
  }
);

request.on('error', (err) => {
  console.log(err);
});

request.write(data);

request.end();
