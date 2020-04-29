const axios = require('axios');
const fs = require('fs');

axios({
  method: 'post',
  url: 'http://localhost:8080/users',
  data: {
    userName: 'danny'
  },
  transformRequest: (data, headers) => {
    const newData = {
      userName: data.userName + '!'
    }
    return JSON.stringify(newData);
  }
})
  .then((response) => {
    console.log('res', response.data);
    response.data.pipe(fs.createWriteStream('google.html'))
  })
  .catch((error) => {
    console.log(error)
  });

const getMetadata = () => {
  return axios.get('http://localhost:8080/metadata?id=1')
}
axios.all([
  getMetadata(),
  getMetadata()
]).then((responseArray) => {
  console.log('multiple', responseArray[0].data.description)
  console.log('multiple', responseArray[1].data.description)
});