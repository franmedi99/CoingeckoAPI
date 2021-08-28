const mysql = require('mysql');
const { promisify }= require('util');
const { database } = require('./keys');
const express = require('express');
const app = express();
var colors = require('colors');
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
     return console.error(colors.underline.red('Database connection was closed.'));
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
     return  console.error(colors.underline.red('Database has to many connections'));
    }
    if (err.code === 'ECONNREFUSED') {
     return console.error(colors.underline.red('Database connection was refused'));
    }
    return console.error(colors.underline.red('Failed to connect database'));
   
  
  }

  if (connection) connection.release();
  console.log(colors.underline.green('DB is Connected'));
   
  return app.emit("ready")
     
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
