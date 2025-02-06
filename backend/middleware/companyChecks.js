const db = require('../models');

// Validate company form data
exports.validateCompanyForm = (req, res, next) => {
    const { 
        companyName, 
        companyDescription, 
        industry, 
        companySize,
        contactEmail, 
        contactPhone, 
        address, 
        city, 
        state,
        country, 
        postalCode 
    } = req.body;

    // Check required fields
    if (!companyName || companyName.trim() === '') {
        return res.status(400).json({ error: 'Company name is required' });
    }

    if (!industry || industry.trim() === '') {
        return res.status(400).json({ error: 'Industry is required' });
    }

    if (!companySize) {
        return res.status(400).json({ error: 'Company size is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail)) {
        return res.status(400).json({ error: 'Valid contact email is required' });
    }

    // Validate phone number (basic check)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!contactPhone || !phoneRegex.test(contactPhone)) {
        return res.status(400).json({ error: 'Valid contact phone number is required' });
    }

    // Validate address fields
    if (!address || address.trim() === '') {
        return res.status(400).json({ error: 'Address is required' });
    }

    if (!city || city.trim() === '') {
        return res.status(400).json({ error: 'City is required' });
    }

    if (!state || state.trim() === '') {
        return res.status(400).json({ error: 'State is required' });
    }

    if (!country || country.trim() === '') {
        return res.status(400).json({ error: 'Country is required' });
    }

    if (!postalCode || postalCode.trim() === '') {
        return res.status(400).json({ error: 'Postal code is required' });
    }

    next();
};

// Check if company exists by name
exports.checkCompanyExists = async (req, res, next) => {
    try {
        // Check if company name exists
        const existingCompany = await db.Company.findOne({
            where: { companyName: req.body.companyName }
        });

        if (existingCompany) {
            return res.status(400).json({ 
                error: 'This company name is already taken. Please choose a different name.'
            });
        }

        // Check if employee already has a company
        const existingEmployeeCompany = await db.Company.findOne({
            where: { employeeId: req.user.id }
        });

        if (existingEmployeeCompany) {
            return res.status(400).json({ 
                error: 'You have already created a company.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
