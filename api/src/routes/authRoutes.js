const auth = require('../modules/authentication');
const validation = require('../modules/inputValidation');
const userDb = require('../db/userDb.js');
const express = require('express');
const router = express.Router();
const prescriptionDb = require('../db/prescriptionDb.js');

const COOKIE_NAME = 'jwt';
const EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour


// GET /health
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // basic username and password validation
  if (!validation.validateCredentials(username, password)) {
    res.status(400).send('Malformed login data');
    return;
  }

  userDb.getUserByUsername(username).then((user) => {
    if (!user) {
      res.status(401).send('Invalid credentials');
      return;
    }

    const computedHash = auth.hashPassword(password, user.usr_salt);

    if (computedHash.compare(user.usr_password) !== 0) {
      res.status(401).send('Invalid credentials');
      return;
    }

    // construct jwt token
    const token = auth.constructToken(user.usr_id);

    // set a cookie with the JWT
    res.cookie(COOKIE_NAME, token, { 
      httpOnly: true,
      maxAge: EXPIRATION_TIME,
      secure: true
    });

     /**
     * Iterates through all the prescriptions assigned to a user when they log in to check if any of their prescriptions are passed the end date.
     * Then it updates the prescription in the table by setting active to false through the updatePrescriptionHistory method
     */
    let currentDate = new Date();
    prescriptionDb.getPrescriptionsByUser(user.usr_id).then((prescriptions) => {
      prescriptions.forEach((prescription) => {
        let expirationDate = new Date(prescription.pre_end_date);

        if (expirationDate < currentDate) {
          prescriptionDb.updatePrescriptionHistory(prescription.pre_id);
        }
      });
    });
          


    // send a 200 response with some user data
    res.status(200).send({ token: token, user: user.usr_id });
  });
});


// POST /logout
router.post('/logout', (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  
  // res.cookie(COOKIE_NAME, '', { expires: new Date(0) });
  res.clearCookie(COOKIE_NAME);
  res.status(200).send('Successfully logged out');
});


// POST /register
router.post('/register', async (req, res) => {

  const { username, password, firstname, lastname, email } = req.body;

  // basic username and password validation
  if (!validation.validateCredentials(username, password)) {
    return res.status(400).send('Malformed login data');
  }

  // check that username is available
  if (await userDb.getUserByUsername(username) !== null) {
    res.status(409).send('Username taken');
    return;
  }

  const salt = auth.generateSalt(); // generate a salt
  const hashedPassword = auth.hashPassword(password, salt);

  // save user to db
  const user = {
    "usr_username": username,
    "usr_password": hashedPassword,
    "usr_firstname": firstname,
    "usr_lastname": lastname,
    "usr_email": email,
    "usr_salt": salt
  };

  userDb.postUser(user);

  res.status(200).send('Successfully registered new user');
});


// GET /currentuser
router.get('/currentuser', (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if(!auth.getUserFromToken(token)) {
    return res.status(401).send('Unauthorized');
  }

  res.status(200).send(user);
});


module.exports = router;