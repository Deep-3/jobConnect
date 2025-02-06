const passport = require('../passport/paaport');
const express=require('express');
const goolecontroller=require('../controllers/googlecontroller')
const auth=require('../middleware/auth')
const router=express.Router();

router.use(auth.checkRegistrationFlow)
router.get('/google',passport.authenticate('google',{scope:['email','profile'],prompt: 'select_account'}));

router.get('/google/callback',goolecontroller.authGoogle);



module.exports=router;