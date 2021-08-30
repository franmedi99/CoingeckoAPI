const {Router} = require('express');
const router = Router();
const passport = require('passport');
const CryptoController = require('../controllers/CryptoController');



router.post("/setcoinpref",passport.authenticate('jwt',{session : false}),CryptoController.setcoinpreference)

router.post("/list",passport.authenticate('jwt',{session : false}),CryptoController.list)

router.post("/top",passport.authenticate('jwt',{session : false}),CryptoController.top)

router.post("/newcrypto",passport.authenticate('jwt',{session : false}),CryptoController.newcrypto)





module.exports = router;