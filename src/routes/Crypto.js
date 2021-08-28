const {Router} = require('express');
const router = Router();
const passport = require('passport');
const CryptoController = require('../controllers/CryptoController');





router.post("/list",passport.authenticate('jwt',{session : false}),CryptoController.list)






module.exports = router;