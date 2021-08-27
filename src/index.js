const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

//Settings
const app = express();
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));

//Routes
app.use('/api/',require('./routes/Users'));



//initializing server
require('./database/conexion');
app.listen(app.get('port'), () => {
    console.log('Environment:', process.env.NODE_ENV);
    console.log('server on port', app.get('port'))
});
