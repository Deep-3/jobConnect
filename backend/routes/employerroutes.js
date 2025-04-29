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
router.get('/checkcompany',employerController.checkCompanyExists)

// Job Management
router.post('/jobs', isAuthenticated, isEmployer, employerController.createJob);
router.get('/jobs', isAuthenticated, isEmployer, employerController.getCompanyJobs);

// Admin Routes
router.get('/companies/pending', isAuthenticated, isAdmin, employerController.getPendingCompanies);
router.post('/company/verify/:companyId', isAuthenticated, isAdmin, employerController.verifyCompany);

//interviewschedule
router.post('/jobapplication/interview',isAuthenticated,isEmployer,interviewcontroller.scheduleInterview)
router.get('/jobapplication/interview/:id',isAuthenticated,isEmployer,interviewcontroller.getInterviewDetails)

//particular application
router.get('/jobapplication/:id',isAuthenticated,isEmployer,employerController.particularJobApplication)

router.get('/getapplication',isAuthenticated,isEmployer,employerController.getApplication)
router.put('/jobapplication/update-status',isAuthenticated,isEmployer,employerController.updateApplication)

//dashboard
router.get('/dashboard',isAuthenticated,isEmployer,employerController.getDashboard)
//reportgeenration
router.get('/reportcsv/:id',isAuthenticated,isEmployer,employerController.applicationDataCsv)
module.exports = router; 