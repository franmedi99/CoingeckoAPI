//definiendo modulo para exportar
const UserController = {};
//modulo para usar tokens
const JWT = require('jsonwebtoken');
//Base de datos
const pool = require('../database/conexion');
//Importando funciones para encriptado y verificado
const helpers = require('../helpers/bcrypt');


//Funcion para crear un token
UserController.signToken = userID => {
     return JWT.sign({
          iss: "franmedi99",
          sub: userID
     }, "franmedi99", { expiresIn: "3h" });
}
//Registra nuevo usuario
UserController.register = async (req, res) => {
     const { username, name, surname, password } = req.body;
     if (username == null || name == null || surname == null || password == null || username === "" || name === "" || surname === "" || password ==="") {
          res.status(400).json({ message: { msgBody: "Please complete all fields", msgError: true } });
     } else {
          const UserResult = await pool.query('SELECT * FROM users WHERE username = ?', [username])
          if (UserResult.length >= 1) {
               res.status(400).json({ message: { msgBody: "This username is already registered", msgError: true } });
          } else {
               const NewUser = { username, name, surname, password };
               NewUser.password = await helpers.encryptPassword(password);
               await pool.query('INSERT into users SET ?', NewUser);
               res.status(201).json({ message: { msgBody: "Successfully Registered User", msgError: false } });
          }
     }
}

//Funcion para verificar autenticacion,setear cookie y enviar objeto de usuario con datos
UserController.login = (req, res) => {
     if (req.isAuthenticated()) {
          const { id_user, username, name, surname, coinpreference } = req.user;
          const token = UserController.signToken(id_user);
          res.cookie('access_token', token, { httpOnly: true, sameSite: true });
          res.status(200).json({ isAuthenticated: true, user: { id_user, username, name, surname, coinpreference } });
     }
};

//Vacia la cookie y arreglo con los datos del usuario
UserController.logout = (req, res) => {
     res.clearCookie('access_token');
     res.json({ user: { id_user: "", username: "", name: "", surname: "", coinpreference: "" }, success: true });
}

//Elimina la cuenta propia del usuario
UserController.deleteAccount = async (req, res) => {
     const { id_user } = req.user[0];
     await pool.query('DELETE FROM users WHERE id_user = ?', [id_user]);
     res.status(200).json({ message: { msgBody: "Account successfully deleted", msgError: false } });

}

module.exports = UserController;