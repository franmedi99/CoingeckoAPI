const { Router } = require('express');
const router = Router();
const passport = require('passport');
const CryptoController = require('../controllers/CryptoController');


//Ruta para seleccionar una preferencia de moneda
router.post("/setcoinpref", passport.authenticate('jwt', { session: false }), CryptoController.setcoinpreference)

//Ruta para mostrar datos de una API externa
router.post("/list", passport.authenticate('jwt', { session: false }), CryptoController.list)

//Ruta para obtener top personal de un usuario
router.post("/top", passport.authenticate('jwt', { session: false }), CryptoController.top)

//Ruta para agregar una nueva criptomoneda a un top personal
router.post("/newcrypto", passport.authenticate('jwt', { session: false }), CryptoController.newcrypto)

//Ruta para borrar una criptomoneda de un top personal
router.get("/deleteoftop/:id_coin", passport.authenticate('jwt', { session: false }), CryptoController.deleteoftop)





module.exports = router;