const passport = require('../passport/paaport');

// controllers/googlecontroller.js
exports.authGoogle = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.send(`
        <script>
          window.opener.postMessage(
            { success: false, message: 'Authentication failed' },
            '${process.env.FRONTEND_URL}'
          );
          window.close();
        </script>
      `);
    }

    if (!user) {
      return res.send(`
        <script>
          window.opener.postMessage(
            { 
              success: false, 
              message: '${info.message || 'Authentication failed'}'
            },
            '${process.env.FRONTEND_URL}'
          );
          window.close();
        </script>
      `);
    }

    // Handle pending registration case
    if (user.pendingRegistration) {
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.send(`
            <script>
              window.opener.postMessage(
                { success: false, message: 'Registration failed' },
                '${process.env.FRONTEND_URL}'
              );
              window.close();
            </script>
          `);
        }
        return res.send(`
          <script>
            window.opener.postMessage(
              { 
                success: true, 
                isNewUser: true,
                message: 'Please select your role'
              },
              '${process.env.FRONTEND_URL}'
            );
            window.close();
          </script>
        `);
      });
    } else {
      // Existing user
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.send(`
            <script>
              window.opener.postMessage(
                { success: false, message: 'Login failed' },
                '${process.env.FRONTEND_URL}'
              );
              window.close();
            </script>
          `);
        }
        return res.send(`
          <script>
            window.opener.postMessage(
              { 
                success: true, 
                isNewUser: false,
                message: 'Login successful'
              },
              '${process.env.FRONTEND_URL}'
            );
            window.close();
          </script>
        `);
      });
    }
  })(req, res, next);
};