const express = require('express');
const loginController = require('../controllers/logincontroller');
const auth=require('../middleware/auth')
const router = express.Router();

// Route for user registration and OTP sending

router.get('/logout',loginController.logout);

router.use(auth.checkRegistrationFlow)
router.post('/login',loginController.login);

// Route for OTP verification
    
module.exports = router;
