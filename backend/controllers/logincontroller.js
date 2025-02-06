const passport = require('../passport/paaport');
const { sendOtp } = require('../utils/otpmail');
const crypto = require('crypto');
// Login Controller
exports.login = async(req, res, next) => {
  passport.authenticate('local', async(err, user, info) => {
    try {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info.message });

      // Check if user needs verification
      if (!user.isVerified) {
        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        
        // Send OTP
        await sendOtp(user.email, otp);
        
        // Store email in session
        req.session.verifyEmail = user.email;
        return res.send("Please verify your account with OTP");
      }

      // If verified but no role, redirect to role selection
      if (!user.role) {
        const tempUser = {
          pendingRegistration: true,
          name: user.name,
          email: user.email,
          authProvider: 'local',
          isVerified: true
        };
        
        req.login(tempUser, (err) => {
          if (err) return next(err);
          return res.redirect('/users/select-role');
        });
        return;
      }

      // Normal login for verified users with roles
      req.login(user, (err) => {
        if (err) return next(err);
        req.flash('success', 'Login successful');
        return res.redirect('/');
      });

    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.json({ session:req.session,message: 'Logout successful.' });
  });
};