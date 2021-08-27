const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
     return console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
     return  console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
     return console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  return console.log('DB is Connected');

});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
