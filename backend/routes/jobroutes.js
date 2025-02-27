const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobseekercontroller');
const jobcontroller=require('../controllers/jobcontroller')  //findalljob
const { isJobSeeker } = require('../middleware/roleCheck');

// Apply middleware to all routes
// router.use(isJobSeeker);

// Profile Management
router.get('/profile', jobSeekerController.getProfile);
router.put('/profile', jobSeekerController.updateProfile);

// Job Applications
router.post('/jobs/:jobId/apply', jobSeekerController.submitApplication);
router.get('/applications', jobSeekerController.getMyApplications);
router.get('/alljob',jobcontroller.getAllJob);

module.exports = router; 