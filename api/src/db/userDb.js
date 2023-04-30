const base64url = require('base64url');

const db = require('./db');

function getUserById(id) {
  return db.query('SELECT * FROM user WHERE usr_id=? LIMIT 1', [id]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      results[0]["usr_password"] = Buffer.from(results[0]["usr_password"], "base64url");
      results[0]["usr_salt"] = Buffer.from(results[0]["usr_salt"], "base64url");
      return results[0];
    }
  });
};

function getUserByUsername(username) {
  return db.query("SELECT * FROM `user` WHERE `usr_username`=? LIMIT 1", [username]).then(({results, fields}) => {
    if (results.length === 0) {
      return null;
    } else {
      results[0]["usr_password"] = Buffer.from(results[0]["usr_password"], "base64url");
      results[0]["usr_salt"] = Buffer.from(results[0]["usr_salt"], "base64url");
      return results[0];
    }
  });
};

function postUser(user) {
  return db.query('INSERT INTO user (usr_username, usr_password, usr_firstname, usr_lastname, usr_email, usr_salt) VALUES (?, ?, ?, ?, ?, ?)', 
      [user.usr_username, base64url.encode(user.usr_password), user.usr_firstname, user.usr_lastname, user.usr_email, base64url.encode(user.usr_salt)]).then(({results}) => {
    return results;
  })
}

function getUserIdByUsername(username) {
  return db.query('SELECT usr_id FROM user WHERE usr_username=? LIMIT 1', [username]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  })
}

function getCaretakersFromUser(userId) {
  return db.query('SELECT usr_id, usr_username FROM caretaker LEFT JOIN user ON ct_usr_id=usr_id WHERE ct_usr_id_care=?', [userId]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results;
    }
  });
}

function getCaretakerUsers(caretakerId) {
  return db.query('SELECT usr_id, usr_username, ct_usr_id_care FROM caretaker LEFT JOIN user ON ct_usr_id_care=usr_id WHERE ct_usr_id=?', [caretakerId]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results;
    }
  });
}

function postCaretaker(caretaker) {
  return db.query('INSERT INTO caretaker (ct_usr_id, ct_usr_id_care) VALUES (?, ?)', [caretaker.ct_usr_id, caretaker.ct_usr_id_care]).then(({results}) => {
    return results;
  })
}

function deleteCaretaker(caretaker) {
  return db.query('DELETE FROM caretaker WHERE ct_usr_id=? AND ct_usr_id_care=?', [caretaker.ct_usr_id, caretaker.ct_usr_id_care]).then(({results}) => {
    return results;
  })
}

function getSubscription(userId) {
  return db.query('SELECT * FROM user_subscriptions WHERE us_usr_id=? LIMIT 1', [userId]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  })
}

function postSubscription(userId, subscriptionJson) {
  return db.query('INSERT INTO user_subscriptions (us_usr_id, us_sub) VALUES (?, ?)', [userId, subscriptionJson]).then(({results}) => {
    return results;
  })
}

function putSubscription(userId, subscriptionJson) {
  return db.query('UPDATE user_subscriptions SET us_sub=? WHERE us_usr_id=?', [subscriptionJson, userId]).then(({results}) => {
    return results;
  })
}

function deleteSubscriptionEndpoint(userId) {
  return db.query('DELETE FROM user_subscriptions WHERE us_usr_id=?', [userId]).then(({results}) => {
    return results;
  })
}

module.exports = {
  getUserById,
  getUserByUsername,
  postUser,
  getUserIdByUsername,
  getCaretakersFromUser,
  getCaretakerUsers,
  postCaretaker,
  deleteCaretaker,
  getSubscription,
  postSubscription,
  putSubscription,
  deleteSubscriptionEndpoint
}