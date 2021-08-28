const express = require('express');
const morgan = require('morgan');
var colors = require('colors');
const cookieParser = require('cookie-parser');
if (process.env.NODE_ENV === 'development') {
     require('dotenv').config();
 }
//Settings
const app = express();
app.use(cookieParser());
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));


//Routes
app.use('/api/',require('./routes/Users'));




//initializing server

     app.listen(app.get('port'), () => {
     console.log(colors.underline.magenta('Environment:', process.env.NODE_ENV));
     console.log(colors.underline.blue('server on port '+app.get('port')))
});





