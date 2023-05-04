const express = require("express");
const router = express.Router();
const prescriptionDb = require("../db/prescriptionDb");
const userDb = require("../db/userDb");
const authentication = require("../modules/authentication");
const { notifyAt } = require("../modules/push");

// GET /prescriptions
router.get("/", (req, res) => {
    prescriptionDb.getPrescriptionsByUser(req.usr_id).then((prescriptions) => {
        res.status(200).send(prescriptions);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// GET /prescriptions/{prescriptionId}
router.get("/id/:prescriptionId", (req, res) => {
    prescriptionDb.getPrescriptionById(req.params.prescriptionId).then((prescription) => {
        if (!prescription) {
            res.sendStatus(404);
            return;
        }
        authentication.isAllowedToView(req.usr_id, prescription.pre_usr_id).then(allowed => {
            if (allowed) {
                res.status(200).send(prescription);
            } else {
                res.sendStatus(403);
            }
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// GET /prescriptions/user/{userId}
router.get("/user/:userId", (req, res) => {
  prescriptionDb.getPrescriptionsByUser(req.params.userId).then((prescriptions) => {
    authentication.isAllowedToView(req.usr_id, req.params.userId).then(allowed => {
        if (allowed) {
            res.status(200).send(prescriptions);
        } else {
            res.sendStatus(403);
        }
    });
  }).catch((error) => {
    res.status(500).send(error);
    });
});

// GET /prescriptions/history
router.get("/history", (req, res) => {
    prescriptionDb.getPrescriptionHistoryByUser(req.usr_id).then((prescriptions) => {
        res.status(200).send(prescriptions);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// GET /prescriptions/history/user/{userId}
router.get("/history/user/:userId", (req, res) => {
    prescriptionDb.getPrescriptionHistoryByUser(req.params.userId).then((prescriptions) => {
        authentication.isAllowedToView(req.usr_id, req.params.userId).then(allowed => {
            if (allowed) {
                res.status(200).send(prescriptions);
            } else {
                res.sendStatus(403);
            }
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// GET /prescriptions
router.get("/caretakers", (req, res) => {
  prescriptionDb.getPrescriptionsByCaretaker(req.usr_id).then((prescriptions) => {
    res.status(200).send(prescriptions);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

// POST /prescriptions
router.post("/", (req, res) => {
  prescriptionDb.getMedicineByName(req.body.name).then((medicine) => {
    if (medicine) {
      const newPrescription = {
        'pre_usr_id': req.usr_id,
        'pre_med_id': medicine.med_id,
        'pre_dosage': req.body.dosage,
        'pre_frequency': req.body.frequency,
        'pre_instructions': 'default',
        'pre_start_date': req.body.start_date,
        'pre_end_date': req.body.end_date,
        'pre_description': req.body.description
      };
      console.log(newPrescription);
      prescriptionDb.postPrescription(newPrescription).then(() => {
        const nextDose = new Date((Date.now().getTime()) + (req.body.frequency * 60 * 60 * 1000));
        const dayAfterEnd = new Date((new Date(req.body.end_date).getTime()) + (24 * 60 * 60 * 1000));

        if(nextDose < dayAfterEnd) {
          userDb.getSubscription(req.usr_id).then((subscription) => {
            if (subscription) {
              notifyAt(subscription, JSON.stringify({
                title: 'Med Reminder 🕒',
                body: `It's time to take your ${req.body.dosage} of ${req.body.name}.`
              }), nextDose);
            }
          })
        }
        
        res.status(200).send('Created prescription successfully');
      }).catch((error) => {
        res.status(500).send(error);
      })
    } else {
      res.status(400).send('Invalid medicine name');
    }
  });
});

// For last dose
// PUT /prescriptions/{prescriptionId}
router.put("/:prescriptionId", (req, res) => {
  prescriptionDb.getPrescriptionById(req.params.prescriptionId).then((prescription) => {

    if (prescription) {
      authentication.isAllowedToView(req.usr_id, prescription.pre_usr_id).then(allowed => {
        if (allowed) {
          prescriptionDb.updatePrescriptionLastDose(req.params.prescriptionId, req.body.pre_last_dose).then(() => {
            const nextDose = new Date((new Date(req.body.pre_last_dose).getTime()) + (req.body.frequency * 60 * 60 * 1000));
            const dayAfterEnd = new Date((new Date(req.body.end_date).getTime()) + (24 * 60 * 60 * 1000));

            if(nextDose < dayAfterEnd) {
              userDb.getSubscription(req.usr_id).then((subscription) => {
                if (subscription) {
                  notifyAt(subscription, JSON.stringify({
                    title: 'Med Reminder 🕒',
                    body: `It's time to take your ${req.body.dosage} of ${req.body.name}.`
                  }), nextDose);
                }
              })
            }

            res.status(200).send('Updated prescription successfully');
          }
          ).catch((error) => {
            res.status(500).send(error);
          });
        } else {
          res.sendStatus(403);
        }
      });
    } else {
        res.status(400).send('Invalid prescription id');
    }
  });
});

router.get("/medications", (req, res) => {
    prescriptionDb.getAllMedications().then((medications) => {
        res.status(200).send(medications);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// DELETE /prescriptions/history
router.delete("/history", (req, res) => {
    prescriptionDb.deletePrescriptionHistoryByUser(req.usr_id).then(() => {
        res.status(200).send('Deleted prescription history successfully');
    }).catch((error) => {
        res.status(500).send(error);
    });
});

module.exports = router;