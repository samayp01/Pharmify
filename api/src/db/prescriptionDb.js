const db = require('./db');

function getPrescriptionById(prescriptionId) {
    return db.query('SELECT `pre_id`, `pre_usr_id`, `pre_dosage`, `pre_frequency`, `pre_instructions`, `pre_start_date`, `pre_end_date`, `pre_last_dose`, `pre_description`, `med_name`, `usr_username`'
        + 'FROM `prescription` LEFT JOIN `medicine` ON `pre_med_id`=`med_id` LEFT JOIN `user` ON `pre_usr_id`=`usr_id` WHERE `pre_id`=? LIMIT 1', [prescriptionId]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  });
};

function getPrescriptionsByUser(userId) {
    return db.query('SELECT `pre_id`, `pre_usr_id`, `pre_dosage`, `pre_frequency`, `pre_instructions`, `pre_start_date`, `pre_end_date`, `pre_last_dose`, `pre_description`, `med_name`, `usr_username`'
          + 'FROM `prescription` LEFT JOIN `medicine` ON `pre_med_id`=`med_id` LEFT JOIN `user` ON `pre_usr_id`=`usr_id` WHERE `active`=true AND `pre_usr_id`=?', [userId]).then(({results}) => {
        return results;
    });
};

function getPrescriptionsByCaretaker(userId) {
  return db.query('SELECT `pre_id`, `pre_usr_id`, `pre_dosage`, `pre_frequency`, `pre_instructions`, `pre_start_date`, `pre_end_date`, `pre_last_dose`, `pre_description`, `med_name`, `usr_username`'
          + 'FROM `caretaker` LEFT JOIN `user` ON `ct_usr_id_care`=`usr_id` LEFT JOIN `prescription` ON `usr_id`=`pre_usr_id` LEFT JOIN `medicine` ON `pre_med_id`=`med_id` WHERE `ct_usr_id` = ?'
          , [userId]).then(({results}) => {
      return results;
  });
};

function getPrescriptionHistoryByUser(userId) {
  return db.query('SELECT `pre_id`, `pre_usr_id`, `pre_dosage`, `pre_frequency`, `pre_instructions`, `pre_start_date`, `pre_end_date`, `pre_last_dose`, `pre_description`, `med_name`, `usr_username`'
        + 'FROM `prescription` LEFT JOIN `medicine` ON `pre_med_id`=`med_id` LEFT JOIN `user` ON `pre_usr_id`=`usr_id` WHERE `active`=false AND `pre_usr_id`=?', [userId]).then(({results}) => {
      return results;
  });
};

function getMedicineByName(medicineName) {
    return db.query('SELECT `med_id` FROM `medicine` WHERE UPPER(`med_name`)=UPPER(?) LIMIT 1', [medicineName]).then(({results}) => {
    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  });
};

function getAllMedications() {
  return db.query('SELECT * FROM medicine').then(({results}) => {
      return results;
  })
}

function postPrescription(prescription) {
  return db.query('INSERT INTO `prescription` (pre_usr_id, pre_med_id, pre_dosage, pre_frequency, pre_instructions, pre_start_date, pre_end_date, pre_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [prescription.pre_usr_id, prescription.pre_med_id, prescription.pre_dosage, prescription.pre_frequency, prescription.pre_instructions, prescription.pre_start_date, prescription.pre_end_date, prescription.pre_description]).then(({results}) => {
    return results;
  });
};

function deletePrescriptionHistoryByUser(userId) {
  return db.query('DELETE FROM `prescription` WHERE `active`=false AND `pre_usr_id` = ?', [userId]).then(({results}) => {
    return results;
  });
};

function updatePrescriptionHistory(prescriptionId) {
  return db.query('UPDATE `prescription` SET `active`=false WHERE `pre_id` = ?', [prescriptionId]).then(({results}) => {
    return results;
  });
};

function updatePrescriptionLastDose(prescriptionId, lastDose) {
  return db.query('UPDATE `prescription` SET `pre_last_dose`=? WHERE `pre_id` = ?', [lastDose, prescriptionId]).then(({results}) => {
    return results;
  });
}

module.exports = {
  getPrescriptionById,
  getPrescriptionsByUser,
  getPrescriptionsByCaretaker,
  getPrescriptionHistoryByUser,
  getMedicineByName,
  getAllMedications,
  postPrescription,
  deletePrescriptionHistoryByUser,
  updatePrescriptionHistory,
  updatePrescriptionLastDose
}