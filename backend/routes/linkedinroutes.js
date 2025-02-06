const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth')
const linkedincontroller=require('../controllers/linkedincontroller')


router.use(auth.checkRegistrationFlow)
router.get('/linkedin',linkedincontroller.authLinkedin)

router.get('/linkedin/callback',linkedincontroller.callbackLinkedin)

module.exports=router;