const {Router} = require('express');
const router = Router();

const passport = require('passport');
const UserController = require('../controllers/UserController');
//Obteniendo todas las estrategias de logeo
require('../lib/passport');


router.get("/example", (req, res) => {
     console.log("respondiendo")
     res.send("response");
})




router.post('/register',UserController.register)

//Ruta para iniciar sesion usando la estrategia local
router.post('/login',passport.authenticate('local',{session : false}),UserController.login)

//Ruta para borrar token y vaciar cookie
router.post('/logout',passport.authenticate('jwt',{session : false}),UserController.logout)

//Ruta para borrar tu propia cuenta
router.post('/deleteaccount',passport.authenticate('jwt',{session : false}),UserController.deleteAccount)



 module.exports = router;