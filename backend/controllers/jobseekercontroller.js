const jobSeekerService = require('../services/jobSeekerService');
const db=require('../models');


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

        const job = await db.Job.findByPk(req.params.jobId, {
            include: [{
                model: db.Company,
                as:'company',
                include: [{
                    model: db.EmployerProfile,
                    as: 'employee'
                }]
            }]
        });

        const employerId = job.company.employee.userId;

        // Create notification data
        const notificationData = {
            jobId: req.params.jobId,
            jobTitle: job.title,
            applicantId: req.user.id,
            applicantName: req.user.name,
            timestamp: new Date(),
            applicationId: result.applicationId,
            employerId: employerId // Add employerId to notification data
        };

        // Create notification in database
        const notification = await db.Notification.create({
            userId: employerId,
            title: 'New Job Application',
            message: `${req.user.name} applied for ${job.title}`,
            type: 'application',
            data: notificationData,
            isRead: false,
            isDelivered: false,
            createdAt: new Date()
        });

        // Check if employer is online and send real-time notification
        const employerSockets = global.connectedUsers.get(employerId);
        if (employerSockets && employerSockets.length > 0) {
            // Format notification for frontend
            const notificationForClient = {
                id: notification.id,
                data: notification.data,
                isRead: false,
                createdAt: notification.createdAt,
                type: notification.type,
                message: notification.message
            };

            // Send to all employer's socket connections
            employerSockets.forEach(socketId => {
                global.io.to(socketId).emit('newApplication', notificationForClient);
            });

            // Mark as delivered since employer is online
            await notification.update({ isDelivered: true });
            console.log(`Real-time notification sent to ${employerSockets.length} connections`);
        } else {
            console.log('Employer offline, notification saved for later delivery');
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


