/**
 * Input Validation Module
 */

const MIN_USERNAME_LENGTH = 1;

const MIN_PASSWORD_LENGTH = 1;

function validateUsername(username) {
  return username && username !== '' && 
    username.length >= MIN_USERNAME_LENGTH &&
    /^[a-zA-Z0-9]+$/.test(username);
}

function validatePassword(password) {
  return password && password !== '' && 
    password.length >= MIN_PASSWORD_LENGTH;
}

function validateCredentials(username, password) {
  return validateUsername(username) && validatePassword(password);
}

module.exports = {
  validateUsername,
  validatePassword,
  validateCredentials
}