const express = require('express');
const userController = require('../controllers/usercontroller');
const axios=require('axios');
const router = express.Router();
const {isAuthenticated}=require('../middleware/auth')


router.post('/', userController.createUser);

// router.use(checkRegistrationFlow);

  router.post('/select-role', userController.selectRole);
// Route for user registration and OTP sending

// Route for OTP verification
router.post('/verifyotp', userController.verifyOtp);

router.put('/addfcmtoken',userController.addfcmtoken)




// router.post('/select-role',userController.selectRole);
module.exports = router;
