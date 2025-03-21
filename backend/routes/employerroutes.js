const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employercontroller');
const interviewcontroller=require("../controllers/interviewcontroller")
const { isAuthenticated, isEmployer, isAdmin } = require('../middleware/auth');
const { validateCompanyForm } = require('../middleware/companyChecks');

// Company Profile Management
router.post('/company',  isAuthenticated,  isEmployer, validateCompanyForm, employerController.createCompanyProfile);
router.get('/company', isAuthenticated, isEmployer, employerController.getCompanyProfile);
router.put('/company', isAuthenticated, isEmployer, employerController.updateCompanyProfile);

// Job Management
router.post('/jobs', isAuthenticated, isEmployer, employerController.createJob);
router.get('/jobs', isAuthenticated, isEmployer, employerController.getCompanyJobs);

// Admin Routes
router.get('/companies/pending', isAuthenticated, isAdmin, employerController.getPendingCompanies);
router.post('/company/verify/:companyId', isAuthenticated, isAdmin, employerController.verifyCompany);

//interviewschedule
router.post('/jobapplication',isAuthenticated,isEmployer,interviewcontroller.scheduleInterview)
router.get('/jobapplication/:id',isAuthenticated,isEmployer,interviewcontroller.getInterviewDetails)
router.get('/jobapplication/token',isAuthenticated,isEmployer,interviewcontroller.getVideoToken)


router.get('/getapplication',isAuthenticated,isEmployer,employerController.getApplication)
router.post('/jobapplication/update-status',isAuthenticated,isEmployer,employerController.updateApplication)

module.exports = router; 