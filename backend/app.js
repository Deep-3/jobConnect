require('dotenv').config();

const express=require('express');
const app=express();
const useRoutes=require('./routes/userroutes');
const loginRoutes=require('./routes/loginroutes')
const googleroutes=require('./routes/googleauthroutes')
const linkedinroutes=require('./routes/linkedinroutes')
const employerroutes=require('./routes/employerroutes')
const jobseekerroutes=require('./routes/jobroutes')
const session = require('express-session');
const flash = require('connect-flash');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize=require('./config/db')

const passport=require('./passport/paaport')
const cors = require('cors');

const fileUpload = require('express-fileupload');

app.use(fileUpload({
  createParentPath: true,
  limits: { 
      fileSize: 5 * 1024 * 1024 // 5MB max file size
  },}));


// Basic CORS setup
// app.use(cors({
//     origin: process.env.FRONTEND_URL,  // Which domains can access
//     credentials: true,                 // Allow cookies
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
// }));
// const corsConfig = {
//   origin: process.env.NODE_ENV === 'production'
//       ? process.env.FRONTEND_URL  // Production: only allow your frontend
//       : 'http://localhost:3000',  // Development: allow localhost
//   credentials: true
// };//this corsconfig pass in core middleware

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

sessionStore.sync();

app.use(session({ 
   secret: 'hellodeep',
   resave: false, 
   saveUninitialized: true, 
   store:sessionStore,
   cookie: { secure: false,
    // sameSite: 'none',  // Required for cross-origin
      maxAge:24*60*60*1000
     } 
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     // console.log('Session:', req.session);
//     // console.log('User:', req.user);  // Check what user is in the session
//     next();
//   });
app.use(flash());

// app.use((req, res, next) => {
//   // Makes flash messages available to all views
//   res.locals.success = req.flash('success');

//   // res.locals.error = req.flash('error');
//   // res.locals.info = req.flash('info');
//   next();
// });
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/users',useRoutes);
app.use('/auth',loginRoutes);
app.use('/gauth',googleroutes)
app.use('/lauth',linkedinroutes)
app.use('/employer', employerroutes)
app.use('/jobseeker',jobseekerroutes)
const PORT = process.env.PORT || 3000;





// app.get('/auth/linkedin', (req, res, next) => {
//   passport.authenticate('linkedin', {
//       state: true,
//       scope: ['openid', 'profile', 'email']  // Explicitly set scopes here as well
//   })(req, res, next);
// });

// app.get('/auth/linkedin/callback', (req, res, next) => {
//   passport.authenticate('linkedin', {
//       successRedirect: '/',
//       failureRedirect: '/',
//       failureFlash: true
//   })(req, res, next);
// });

app.get('/', (req, res) => {
  console.log(req.user)
    if (req.user) {
      res.send(`Hello, ${req.user.name} ${req.flash('success')}`);  // Access `req.user.name` or any other property
    } else {
      res.send('Hello, guest!');
    }
  });
  app.get('/employee',(req,res)=>{
    if(req.user)
    {
      res.send(`hello ,${req.user.name} add company`)
    }
    else {
      res.send('Hello, Employee!');
    }
  })
  app.get('/jobseeker',(req,res)=>{
    if(req.user)
    {
      res.send(`hello ,${req.user.name} please search the company`);
    }
    else {
      res.send('Hello, jobseeker!');
    }
  })

  app.get('/login',(req,res)=>{
    // console.log(success)
    res.send('<a href="/lauth/linkedin">login with linkedin</a><br><a href="/gauth/google">login with google</a>')
  })
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // kem cho badha18008969999