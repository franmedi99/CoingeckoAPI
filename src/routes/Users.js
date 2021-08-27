const {Router} = require('express');
const router = Router();
const UserController = require('../controllers/UserController');


router.post('/register',UserController.register)



 module.exports = router;