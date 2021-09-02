const {Router} = require('express');
const router = Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');

require('../lib/passport');

router.post('/register',UserController.register)

router.post('/login',passport.authenticate('local',{session : false}),UserController.login)

router.post('/logout',passport.authenticate('jwt',{session : false}),UserController.logout)

router.post('/deleteaccount',passport.authenticate('jwt',{session : false}),UserController.deleteAccount)



 module.exports = router;