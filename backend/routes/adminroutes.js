const express = require('express');
const router = express.Router();
const admincontroller=require('../controllers/admincontroller')
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/dashboard',isAuthenticated,isAdmin,admincontroller.getdashboard)
module.exports=router;