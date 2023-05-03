// Middleware module for user token authentication
// const axios = require('axios');

export function authorize() {
  if (!localStorage.getItem('jwt') || !localStorage.getItem('user')) {
    console.log('Unauthorized access.');
    return false;
  }

  // API request to api/currentuser and get a 200ok response
  // const ENDPOINT = '/api';
  // axios.get(`${ENDPOINT}/currentuser`)
  //   .then(response => response.status === 200)
  //   .catch(error => {
  //     console.log(error);
  //     return false;
  //   });
  
  return true;
}