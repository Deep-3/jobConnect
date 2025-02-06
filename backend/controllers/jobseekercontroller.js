const jobSeekerService = require('../services/jobSeekerService');

// Profile Management
exports.getProfile = async (req, res) => {
    try {
        const result = await jobSeekerService.getJobSeekerProfile(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        console.log('Files:', req.files);  // Check uploaded files

        const result = await jobSeekerService.updateProfile(req.user.id, req.body,req.files);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Job Applications
exports.submitApplication = async (req, res) => {
    try {
        const result = await jobSeekerService.applyForJob(
            req.user.id,
            req.params.jobId,
            req.body
        );
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const result = await jobSeekerService.getMyApplications(req.user.id);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error
            });
        }

        // If no applications found
        if (result.count === 0) {
            return res.status(200).json({
                success: true,
                message: 'No applications found',
                data: []
            });
        }

        // Success response with applications
        return res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            count: result.count,
            data: result.data
        });

    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
