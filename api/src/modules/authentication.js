/**
 * Authentication Module
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userDb = require('../db/userDb');

const ITERATIONS = 1000;
const KEYLEN = 64;
const HASH_ALGORITHM = 'sha256';
const API_SECRET_KEY = process.env.API_SECRET_KEY;
const COOKIE_NAME = 'jwt';

// Generated a random salt
function generateSalt() {
  return crypto.randomBytes(16);
}

// Hashes a password with a specified salt
function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, HASH_ALGORITHM);
}

// Constructs a JWT token from a user object
function constructToken(user) {
  return jwt.sign({ user }, API_SECRET_KEY, { 
    algorithm: 'HS256',
    expiresIn: '1h'
  });
}

// Decodes a JWT token
function decodeToken(token) {
  try {
    return jwt.verify(token, API_SECRET_KEY);
  } catch (err) {
    return null;
  }
}

// Get user from token payload
function getUserFromToken(token) {
  const payload = decodeToken(token);
  return payload ? payload.userId : null;
}

// Authentication middleware
function authenticateRequest(req, res, next) {
  let jwtToken = undefined;
  if (req.headers.authorization !== undefined) {
    let splitAuth = req.headers.authorization.split(" ");
    if (splitAuth[0] == 'Bearer' && splitAuth.length == 2) {
      jwtToken = splitAuth[1];
    }
  }
  if (jwtToken === undefined && req.cookies) {
    if (req.cookies && req.cookies[COOKIE_NAME]) {
      jwtToken = req.cookies[COOKIE_NAME];
    }
  }
  if (jwtToken === undefined) {
    // The user needs to log in
    res.writeHead(302, {
      'Location': '/login'
    });
    return;
  }
  let allegedUserId = decodeToken(jwtToken);
  if (!allegedUserId) {
    res.status(400).send('JWT token not signed')
    return;
  }
  req['usr_id'] = allegedUserId.user;
  next();
}

function isAllowedToView(currentUserId, askUserId) {
  console.log(`Checking that ${currentUserId} can see ${askUserId}`)
  return userDb.getCaretakerUsers(currentUserId).then(caretakers => {
    if (currentUserId == askUserId) return true;

    if (caretakers == null) {
      return false;
    }

    for (let i = 0; i < caretakers.length; i++) {
      console.log(`\t${caretakers[i].ct_usr_id_care}`)
      if (caretakers[i].ct_usr_id_care == askUserId) {
        console.log("Is caretaker");
        return true;
      }
    }

    return false;
  });
}

module.exports = {
  generateSalt,
  hashPassword,
  constructToken,
  decodeToken,
  getUserFromToken,
  authenticateRequest,
  isAllowedToView
}