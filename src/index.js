//Crear un servidor de forma sencilla con express
const express = require('express');
//Morgan para mostrar por consola todas  las peticiones que llegan al servidor
const morgan = require('morgan');
//Colors para pintar por consola mensajes coloridos 
var colors = require('colors');
//CookieParser para que la aplicacion acepte trabajar con cookies
const cookieParser = require('cookie-parser');
//En el caso que este en modo desarrollo o test se incluya el archivo .env
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
     require('dotenv').config();
 }
//Settings
const app = express();
//permitiendo cookies
app.use(cookieParser());
//permitiendo objetos JSON
app.use(express.json());
//Definiendo puerto
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));


//Rutas
app.use('/api/',require('./routes/Users'),require('./routes/Crypto'));


//initializing server
     app.listen(app.get('port'), () => {
     console.log(colors.underline.magenta('Environment:', process.env.NODE_ENV));
     console.log(colors.underline.blue('server on port '+app.get('port')));
});





module.exports =app;