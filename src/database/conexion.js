const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
var colors = require('colors');
const pool = mysql.createPool(database);

//Verifica la conexion y devuelve por consola si esta conectado o no
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return console.error(colors.underline.red('Database connection was closed.'));
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      return console.error(colors.underline.red('Database has to many connections'));
    }
    if (err.code === 'ECONNREFUSED') {
      return console.error(colors.underline.red('Database connection was refused'));
    }
    return console.error(colors.underline.red('Failed to connect database'));


  }

  if (connection) connection.release();
  console.log(colors.underline.green('DB is Connected'));



});

//Crea compatibilidad con asincronismo para un objeto que solo soporta callbacks
pool.query = promisify(pool.query);

module.exports = pool;
