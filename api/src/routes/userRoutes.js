const express = require("express");
const router = express.Router();
const userDb = require("../db/userDb");
const webpush = require("web-push");
const authentication = require("../modules/authentication");

// GET requesting user info
router.get("/", (req, res) => {
  userDb.getUserById(req.usr_id).then((user) => {
    if (!user) {
      res.status(500).send('User not found with valid token');
      return;
    }

    delete user['usr_password'];
    delete user['usr_salt'];

    res.status(200).send(user);
  });
});

// GET /users/{userId}
router.get("/:userId", (req, res) => {
  userDb.getUserById(req.params.userId).then((user) => {
    authentication.isAllowedToView(req.usr_id, req.params.userId).then(allowed => {
      if (allowed) {
        if (!user) {
          res.status(404).send('User not found');
          return;
        }

        delete user['usr_password'];
        delete user['usr_salt'];

        res.status(200).send(user);
      } else {
        res.sendStatus(403);
      }
    });
  });
});

router.get("/:userId/caretaker", (req, res) => {
  userDb.getUserById(req.params.userId).then((user) => {
    authentication.isAllowedToView(req.usr_id, req.params.userId).then(allowed => {
      if (allowed) {
        if (!user) {
          res.status(404).send('User not found');
          return;
        }

        userDb.getCaretakersFromUser(req.params.userId).then((caretakers) => {
          if (!caretakers) {
            res.status(200).send([]);
          } else {
            res.status(200).send(caretakers);
          }
          return;
        });
      } else {
        res.sendStatus(403);
      }
      return;
    });
  });
});

// POSTS A NEW CARETAKER
router.post("/caretaker", (req, res) => {
  console.log(req.body["name"]);
  userDb.getUserIdByUsername(req.body["name"]).then((user) => {
    if (user) {
      caretaker = {

        //assigns user id found to take care of current user
        ct_usr_id: user.usr_id,
        ct_usr_id_care: req.usr_id
      }
      userDb.postCaretaker(caretaker).then(() => {
        res.status(200).send('Caretaker added');
      }).catch((error) => {
        res.status(500).send(error);
      })

    } else {
      res.status(404).send('User not found');

    }
  });
});

// SUBSCRIBE TO PUSH NOTIFICATIONS
router.post("/subscribe", (req, res) => {
  userDb.getSubscription(req.usr_id).then((subscription) => {
    if (subscription) {
      userDb.putSubscription(req.usr_id, JSON.stringify(req.body["subscription"])).then(() => {
        res.status(200).send('Subscription added');
    
        webpush.sendNotification(req.body["subscription"], "You are subscribed to notifications!");
      }).catch((error) => {
        res.status(500).send('Failed to update subscription');
      })
    } else {
      userDb.postSubscription(req.usr_id, JSON.stringify(req.body["subscription"])).then(() => {
        res.status(200).send('Subscription added');
    
        webpush.sendNotification(req.body["subscription"], "You are subscribed to notifications!");
      }).catch((error) => {
        res.status(500).send('Failed to add subscription');
      })
    }
  })
});

// UNSUBSCRIBE FROM PUSH NOTIFICATIONS
router.post("/unsubscribe", (req, res) => {
  userDb.deleteSubscriptionEndpoint(req.usr_id)
    .then(() => res.status(200).send('Subscription deleted'))
    .catch(error => console.log('Error deleting subscription: ' + error));
});


//DELETES A CARETAKER
router.delete("/caretaker", (req, res) => {
  console.log(req.body["name"]);
  userDb.getUserIdByUsername(req.body.name).then((user) => {
    if (user) {
      caretaker = {
        ct_usr_id: user.usr_id,
        ct_usr_id_care: req.usr_id
      }

      userDb.deleteCaretaker(caretaker).then(() => {
        res.status(200).send('Caretaker deleted');
      }).catch((error) => {
        res.status(500).send(error);
      })

    } else {
      res.status(404).send('User not found');

    }
  });
});

module.exports = router;