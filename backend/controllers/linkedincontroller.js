const axios=require('axios');
const db=require('../models');

const params=new URLSearchParams({
  response_type:'code',
   client_id :process.env.LINKEDIN_CLIENT_ID,
   redirect_uri:process.env.LINKEDIN_CALLBACK_URL,
     scope: 'openid profile email',  // OpenID Connect scopes
    prompt: 'select_account',  // Forces account selection

})


// Step 1: Redirect User to LinkedIn for Authorization
exports.authLinkedin=(req, res) => {

  const authURL = `https://www.linkedin.com/oauth/v2/authorization?${params}`
  res.redirect(authURL);

};

// Get LinkedIn Access Token
const getLinkedInAccessToken = async (code) => {
    try {
              const body=new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri:process.env.LINKEDIN_CALLBACK_URL,
            client_id :process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          })
          // Step 3: Exchange Authorization Code for Access Toke
           const response = await axios.post(
              'https://www.linkedin.com/oauth/v2/accessToken',
               body.toString(),
              {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }
          );      
        return response.data.access_token;
    } 
    catch (error) {
        console.error('Access Token Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get LinkedIn User Profile
const getLinkedInProfile = async (accessToken) => {
    try {
    
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        // 
        return  {name:profileResponse.data.name,
            email:profileResponse.data.email
        }
    } 
    catch (error) {
        console.error('Profile Error:', error.response?.data || error.message);
        throw error;
    }
};
// Step 2: Handle LinkedIn's Callback
exports.callbackLinkedin= async (req, res) => {
  const transaction = await db.sequelize.transaction();
    try
    {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('Authorization code is missing');
      }
    // Get access token
    const accessToken = await getLinkedInAccessToken(code);
    console.log(accessToken)
    // Get user profile
    const profile = await getLinkedInProfile(accessToken);

    let user=await db.User.findOne({where:{email:profile.email}})
    
    if (user && user.authProvider !== 'linkedin') {
      
         return res.send({message: `This email is already registered with ${user.authProvider}`})
    
  }


   if (!user) {
    // For new users, create temporary user object and redirect to role selection
    const tempUser = {
      pendingRegistration: true,
      name: profile.name,
      email: profile.email,
      authProvider: 'linkedin'
    };

    // Store in session
    req.login(tempUser, (err) => {
      if (err) throw err;
      res.redirect('/users/select-role');
    });
  } else {
    // Existing user - login and redirect to dashboard
    req.login(user, (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  }
} catch (error) {
  console.error('Error during OAuth flow:', error.response?.data || error.message);
  res.status(500).send('Authentication failed');
}
};