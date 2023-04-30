// Middleware module for user token authentication

export default function authorize() {
  if (!localStorage.getItem('jwt') || !localStorage.getItem('user')) {
    console.log('Unauthorized access.');
    return false;
  }

  // TODO: Make API request to api/currentuser and get a 200ok response
  
  return true;
}