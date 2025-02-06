const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employercontroller');
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

module.exports = router; 