const {Router} = require('express');
const router = Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');

require('../lib/passport');

router.post('/register',UserController.register)

router.post('/login',passport.authenticate('local',{session : false}),UserController.login)

router.post('/logout',passport.authenticate('jwt',{session : false}),UserController.logout)





 module.exports = router;