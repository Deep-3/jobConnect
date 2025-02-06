const userService = require('../services/userservices');
const db=require('../models')


exports.createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    
    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }

    // Store temp user data in session
    req.session.tempUser = result.tempUser;
    req.session.verifyEmail = result.email;

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email',
      email: result.email
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
      const {  otp } = req.body;
      
      // If email not in body, use session email
      const userEmail =req.session.verifyEmail;
      if (!userEmail) {
          return res.status(400).json({ 
              success: false, 
              message: 'Email is required' 
          });
      }
 
      // Call service function
      await userService.verifyOtp(userEmail, otp,req, res);      
  } catch (error) {
      res.status(400).json({ 
          success: false, 
          error: error.message 
      });
  }
};

exports.selectRole=async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    if (!req.user.pendingRegistration) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // const { role } = req.body;
    const user = await userService.createUserWithRole(req.user, 'jobseeker', transaction);
    await transaction.commit();

    
    delete req.session.verifyEmail;
    delete req.session.tempUser;

    // Login as the new user
    req.login(user, (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Role selection error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}