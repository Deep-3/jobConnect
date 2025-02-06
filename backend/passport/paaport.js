const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const axios=require('axios');
const bcrypt = require('bcrypt');
const db = require('../models');  
// Passport LocalStrategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',  
    passwordField: 'password', 
  },
  async (email, password, done) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      
      // If user doesn't exist


      if (user && user.authProvider !== 'local') {
        return done(null, false, { 
            message: `This email is already registered with ${user.authProvider}` 
        }); 
    }
      
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // If passwords don't match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Successful authentication
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));



// passport.use(new LinkedInStrategy({
  // clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  // clientID:process.env.LINKEDIN_CLIENT_ID,
  // callbackURL:process.env.LINKEDIN_CALLBACK_URL,
//   scope: ['openid', 'profile', 'email'],
//   state: true,
  
//   // Additional options that might help
//   response_type: 'code',
//   grant_type: 'authorization_code',
  
//   // Debug options
//   passReqToCallback: true,
//   proxy: false
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//       // Store user data with access token
//       const userData = {
//           // id: profile.id,
//           // email: profile.emails[0].value,
//           // name: profile.displayName,
//           // photo: profile.photos?.[0]?.value,
//           // accessToken
//       };
//       return done(null, userData);
//   } catch (error) {
//       return done(error, null);
//   }
// }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async(accesstoken, refreshtoken, profile, done) => {
  try {
    let user = await db.User.findOne({
      where: { email: profile.emails[0].value }
    });
    
    // Check if user exists with different auth provider
    if (user && user.authProvider !== 'google') {
      return done(null, false, { 
        message: `This email is already registered with ${user.authProvider}` 
      });
    }

    if (!user) {
      // Return pending registration data
      return done(null, {
        pendingRegistration: true,
        name: profile.displayName,
        email: profile.emails[0].value,
        authProvider: 'google'
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  if (user.pendingRegistration) {
    // For users who haven't selected role
    done(null, { pendingRegistration: true, ...user });
  } else {
    // For complete users
    done(null, user.id);
  }
});

// Passport deserialization (used to retrieve user from session)
passport.deserializeUser(async (data, done) => {
  try {
    if (data.pendingRegistration) {
      // Return temporary data for pending registrations
      return done(null, data);
    }
    // Normal user lookup
    const user = await db.User.findByPk(data);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
module.exports=passport;