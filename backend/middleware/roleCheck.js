exports.isJobSeeker = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }
        
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Only job seekers can access this resource'
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error checking user role'
        });
    }
}; 