const db = require('../models');
const User=db.User;
const { sendOtp } = require('../utils/otpmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.createUser = async (userData, res) => {
    try {
      // Check if user exists
      const validUser = await User.findOne({ where: { email: userData.email } });
      if (validUser) {
        return { error: "User already exists" };
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
      // Store in session instead of DB
      const tempUser = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        otp: otp,
        otpExpiry: otpExpiry,
        authProvider: 'local'
      };
  
      // Send OTP
      await sendOtp(userData.email, otp);
  
      return {
        success: true,
        tempUser: tempUser,
        email: userData.email,
        message: 'OTP sent to your email'
      };
  
    } catch (error) {
      return { error: error.message || "An unexpected error occurred" };
    }
  };
  exports.verifyOtp = async (userEmail, otpInput, req, res) => {
    try {
      const tempUser = req.session.tempUser;
  
      if (!tempUser) {
        return res.status(400).json({
          success: false,
          message: 'Registration session expired'
        });
      }
  
      // Check if OTP is expired
      if (new Date() > new Date(tempUser.otpExpiry)) {
        // Generate new OTP
        const newOtp = crypto.randomInt(100000, 999999).toString();
        const newOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  
        // Update temp user with new OTP
        tempUser.otp = newOtp;
        tempUser.otpExpiry = newOtpExpiry;
        req.session.tempUser = tempUser;
  
        // Send new OTP
        await sendOtp(userEmail, newOtp);
  
        return res.status(200).json({
          success: false,
          message: 'OTP expired. New OTP sent to your email',
          otpResent: true
        });
      }
  
      // Verify OTP if not expired
      if (tempUser.otp != otpInput) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }
  
      // Create temporary user for role selection
      const pendingUser = {
        pendingRegistration: true,
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password, // Keep password for final registration
        authProvider: 'local',
        isVerified: true
      };
  
      // Clear verify email from session
      // Login with temporary user
      req.login(pendingUser, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Login failed'
          });
        }
        return res.redirect('/users/select-role');
      });
  
    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
};
  exports.createUserWithRole = async (userData, role, transaction) => {
    try {
      // Create user
      const user = await db.User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: role,
        authProvider: 'local',
        isVerified: true
      }, { transaction });

      await createRoleProfile(user.id,role,transaction);
      return user;
    } catch (error) {
      throw error;
    }
};
const createRoleProfile = async (userId, role, transaction) => {
    try {
      switch(role) {
        case 'jobseeker':
          await db.JobSeekerProfile.create({
            userId: userId
          }, { transaction });
          break;
  
        case 'employee':
          await db.EmployerProfile.create({
            userId: userId,
          }, { transaction });
          break;
  
        default:
          throw new Error('Invalid role');
      }
    } catch (error) {
      throw error;
    }
};