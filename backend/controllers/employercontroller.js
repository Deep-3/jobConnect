const employerService = require('../services/employerService');

// Company Management
exports.createCompanyProfile = async (req, res) => {
    try {
        const result = await employerService.createCompanyProfile(req.body, req.user.id,req.files);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyProfile = async (req, res) => {
    try {
        const result = await employerService.getCompanyProfile(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCompanyProfile = async (req, res) => {
    try {
        const result = await employerService.updateCompanyProfile(req.user.id, req.body);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Job Management
exports.createJob = async (req, res) => {
    try {
        const result = await employerService.createJob(req.user.id, req.body);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyJobs = async (req, res) => {
    try {
        const result = await employerService.getCompanyJobs(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Verification
exports.verifyCompany = async (req, res) => {
    try {
        const result = await employerService.verifyCompany(req.user.id, req.params.companyId);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingCompanies = async (req, res) => {
    try {
        const result = await employerService.getPendingCompanies(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};