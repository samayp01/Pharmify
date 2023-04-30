const mysql = require('mysql');

let connection;

function getDatabaseConnection() {
  if(!connection) {
    connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: process.env.DB_CHARSET
    });
  }
  return connection;
};

function query(query, params = []) {
  return new Promise((resolve, reject) => {
    if(!connection) {
      connection = getDatabaseConnection();
    }
    connection.query(query, params, (err, results, fields) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({
        results: results,
        fields: fields
      })
    })
  });
};

function close() {
  if(connection) {
    connection.end();
    connection = null;
  }
};

module.exports = { getDatabaseConnection, query, close }