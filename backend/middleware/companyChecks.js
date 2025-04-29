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
        console.log(companyName)
        return res.status(400).json({ success:false,message: 'Company name is required' });
    }

    if (!industry || industry.trim() === '') {
        return res.status(400).json({ success:false,message: 'Industry is required' });
    }

    if (!companySize) {
        return res.status(400).json({ success:false,message:'Company size is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail)) {
        return res.status(400).json({ success:false,message:'Valid contact email is required' });
    }

    // Validate phone number (basic check)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!contactPhone || !phoneRegex.test(contactPhone)) {
        return res.status(400).json({ success:false,message:'Valid contact phone number is required' });
    }

    // Validate address fields
    if (!address || address.trim() === '') {
        return res.status(400).json({ success:false,message:'Address is required' });
    }

    if (!city || city.trim() === '') {
        return res.status(400).json({ success:false,message:'City is required' });
    }

    if (!state || state.trim() === '') {
        return res.status(400).json({ success:false,message:'State is required' });
    }

    if (!country || country.trim() === '') {
        return res.status(400).json({success:false,message: 'Country is required' });
    }

    if (!postalCode || postalCode.trim() === '') {
        return res.status(400).json({ success:false,message:'Postal code is required' });
    }

    next();
};


