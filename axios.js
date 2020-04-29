const axios = require('axios');
const fs = require('fs');

axios({
  method: 'post',
  url: 'http://localhost:8080/users',
  data: {
    userNames: ['danny', 'freedy']
  },
  transformRequest: (data, headers) => {
    const newData = data.userNames.map((userName) => {
      return userName + '!';
    });
    return JSON.stringify(newData);
  }
})
  .then((response) => {
    response.data.pipe(fs.createWriteStream('google.html'))
  })
  .catch((error) => {
    console.log(error)
  });