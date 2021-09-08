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
//Configuraciones
const app = express();
//permitiendo cookies
app.use(cookieParser());
//permitiendo objetos JSON
app.use(express.json());
//Definiendo puerto
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));


//---------------------------configuraciones de documentacion------------------------------------
//Creating documentation page
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Francisco Medina API",
			version: "1.0.0",
			description: "API que se encargar de dar de alta a usuarios, que estos mismos, creen su propio Top personalizado con el fin de conseguir un seguimiento propio de criptomonedas elegidas por dicho usuario, comparar precios de criptomonedas seleccionadas por el mismo, autenticarlos con JWT y mantener todos los datos de usuarios de forma persistente en una base de datos (MySQL)",
		},
		servers: [
			{
				url: "http://localhost:3000/api",
			},
		],
	},
	apis: ["./src/documentation/swagger.js"],
};
const specs = swaggerJsDoc(options);

app.use("/doc", swaggerUI.serve, swaggerUI.setup(specs));
//----------------------------fin de configuraciones de documentacion----------------------------


//Rutas
app.use('/api/',require('./routes/Users'),require('./routes/Crypto'));


//iniciando servidor
     app.listen(app.get('port'), () => {
     console.log(colors.underline.magenta('Environment:', process.env.NODE_ENV));
     console.log(colors.underline.blue('server on port '+app.get('port')));
});





module.exports =app;