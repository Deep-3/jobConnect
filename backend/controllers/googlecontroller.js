const passport = require('../passport/paaport');

exports.authGoogle = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      // Handle the case where authentication failed
      // info.message contains the error message from Google Strategy
      req.flash('error', info.message || 'Authentication failed');
      return res.redirect('/');
    }

    // Handle pending registration case
    if (user.pendingRegistration) {
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return next(loginErr);
        }
        return res.redirect('/users/select-role');
      });
      return;
    }

    // Handle successful authentication
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return next(loginErr);
      }
      return res.redirect('/'); // or wherever you want to redirect authenticated users
    });
  })(req, res, next);
};