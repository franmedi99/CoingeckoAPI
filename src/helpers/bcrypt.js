//Modulo para encriptar un  String
const bcrypt = require('bcryptjs');

const helpers = {};

//Encripta un String con el valor password
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

//Verifica que ambas contraseñas coincidan
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;
