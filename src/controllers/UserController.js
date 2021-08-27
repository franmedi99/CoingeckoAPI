const UserController = {};
const JWT = require('jsonwebtoken');
const pool = require('../database/conexion');
const helpers = require('../helpers/bcrypt');
require('../lib/passport');

UserController.signToken = userID =>{
     return JWT.sign({
         iss : "franmedi99",
         sub : userID
     },"franmedi99",{expiresIn : "3h"});
 }

UserController.register = async(req, res)=>{
     const {username,name,surname,password} = req.body;
     if(username==null || name==null||surname==null||password==null){
          res.status(400).json({message : {msgBody : "Por favor Complete Todos los campos", msgError: true}});
     }else{
     const UserResult =await pool.query('SELECT * FROM users WHERE username = ?', [username])
     if(UserResult.length>=1){
          res.status(400).json({message : {msgBody : "Este username ya esta registrado", msgError: true}});
     }else{
          const NewUser = {username,name,surname,password};
          NewUser.password = await helpers.encryptPassword(password);
          await pool.query('INSERT into users SET ?', NewUser);
          res.status(201).json({message : {msgBody : "Usuario Registrado Satisfactoriamente", msgError: false}});
     }
}
}

module.exports = UserController;