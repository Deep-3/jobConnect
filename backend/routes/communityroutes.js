const express=require('express');
const communitycontroller=require('../controllers/communitycontroller')
const router=express.Router();


router.get('/',communitycontroller.getMessage)
router.post('/',communitycontroller.addMessage)


module.exports=router;