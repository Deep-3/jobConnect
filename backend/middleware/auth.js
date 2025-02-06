// Middleware to check if NOT logged in
const db=require('../models')
exports.checkRegistrationFlow = (req, res, next) => {
    // First check if email verification is pending
    // if (req.session.verifyEmail) {
    //     return res.redirect('/users/verifyotp');
    //   }
  
    // Then check authentication and roles
    if (req.isAuthenticated()) {
    //   if (req.user.pendingRegistration) {
    //     return res.redirect('/users/select-role');
    //   }
      if (req.user.role==='employee') {
        return res.redirect('/employee');
      }
      if (req.user.role==='admin') {
        return res.redirect('/admin')
      }
      if(req.user.role==='jobseeker')
        return res.redirect('/');
}
next()
};

// exports.isNotAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//     next();
// };

// // Middleware to check if logged in
// exports.isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//      next();
// };

exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
};

exports.isEmployer = (req, res, next) => {
    if (req.user.role !== 'employee' && req.user.role !== 'hr') {
        return res.status(403).json({ 
            error: 'Access denied. Only employees can access this resource.' 
        });
    }
    next();
};



exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Only Admin can success this page'
            });
        }
        

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not logged in' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'You do not have permission to access this resource' 
            });
        }

        next();
    };
};