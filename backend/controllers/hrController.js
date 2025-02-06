const employeeService = require('../services/employeeService');
const employerService = require('../services/employerService');

exports.getCompanyEmployees = async (req, res) => {
    try {
        const result = await employeeService.getCompanyEmployees(req.user.id);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.inviteEmployee = async (req, res) => {
    try {
        const result = await employeeService.inviteEmployee(req.user.id, req.body);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.assignHRRole = async (req, res) => {
    try {
        const result = await employerService.assignHRRole(req.user.id, req.body.employeeId);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}; 