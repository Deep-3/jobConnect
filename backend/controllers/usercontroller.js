const userService = require('../services/userservices');
const db=require('../models')


exports.createUser = async (req, res) => {
  try {

    const existingSessionId = req.sessionID;
    console.log('Existing session:', existingSessionId);
    const result = await userService. createUser(req.body);
    
    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }
  

    // Store temp user data in session
    req.session.tempUser = result.tempUser;
    req.session.verifyEmail = result.email


    console.log("after create user",req.sessionID,req.cookies);

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
      const { otp,resend } = req.body;
      const resendOtp=resend || false;

      // If email not in body, use session email
      const userEmail = req.session.verifyEmail;

      
      console.log('1. Starting OTP verification');
      console.log('Current session:', req.sessionID);
      console.log('Session data:', req.session);
      
      if (!userEmail) {
          return res.status(400).json({ 
              success: false, 
              message: 'Email is required' 
          });
      }
 
      // Call service function
      await userService.verifyOtp(userEmail, otp,resendOtp,req, res);      
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
    

    const { role } = req.body;
    
    const user = await userService.createUserWithRole(req.user, role, transaction);
    await transaction.commit();


    // Login as the new user
    req.login(user, (err) => {
      if (err) {
        throw err;
      }
      return res.status(200).json({ 
        message: 'Role selected successfully',
        user: user 
      });
    });

  
  
  } catch (error) {
    await transaction.rollback();
    console.error('Role selection error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

exports.addfcmtoken=async(req,res)=>{
  try{
        const {fcmtoken}=req.body;

        const user = await db.User.update(
          { fcmtoken },  // what to update
          {
              where: {
                  id: req.user.id
              }
          }
      );
      const updatedUser = await db.User.findByPk(req.user.id);
        return res.status(200).json({
          success:true,
          message:'FCM token added successfully',
        })
  }
  catch(error)
  {
    console.log(error)
    return res.status(500).json({
      message:'Error adding FCM token',
      error:error.message
      })
  }

}