require('dotenv').config();
const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();
const useRoutes=require('./routes/userroutes');
const loginRoutes=require('./routes/loginroutes')
const googleroutes=require('./routes/googleauthroutes')
const linkedinroutes=require('./routes/linkedinroutes')
const employerroutes=require('./routes/employerroutes')
const jobseekerroutes=require('./routes/jobroutes')
const notificationroutes=require('./routes/notificationroutes')
const session = require('express-session');
const http = require('http');
const server=http.createServer(app);
const SocketIO=require('socket.io')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize=require('./config/db')
const db=require('./models/index')
const passport=require('./passport/paaport')
const cors = require('cors');
const io=SocketIO(server,{
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  } 
});
const fileUpload = require('express-fileupload');

app.use(fileUpload({
  createParentPath: true,
  limits: { 
      fileSize: 5 * 1024 * 1024 // 5MB max file size
  },}));



app.use(cors({
    origin: ['http://localhost:5173'],  // Which domains can access
    credentials: true,                 // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
}));
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

app.use(cookieParser());

app.use(session({
  secret: 'hellodeep',
  resave: false,
  rolling:true,
  saveUninitialized: true,
  // name: 'connect.sid',  // Make sure this matches exactly
  store: sessionStore,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  }
}));

app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);  // Incoming cookies
  console.log('Session:', req.session);          // Session data
  next();
});
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     // console.log('Session:', req.session);
//     // console.log('User:', req.user);  // Check what user is in the session
//     next();
//   });


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
app.use('/notifications',notificationroutes);
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

global.connectedUsers = new Map();
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('userConnected', async(userId) => {
      if (!global.connectedUsers.has(userId)) {
          global.connectedUsers.set(userId, []);
      }
      global.connectedUsers.get(userId).push(socket.id);

      try {
          const pendingNotifications = await db.Notification.findAll({
              where: {
                  userId: userId,
                  isDelivered: false
              },
              order: [['createdAt', 'DESC']]
          });

          if (pendingNotifications.length > 0) {
              pendingNotifications.forEach(notification => {
                  // Ensure consistent notification format
                  const notificationData = {
                      id: notification.id,
                      data: notification.data,
                      isRead: notification.isRead,
                      createdAt: notification.createdAt,
                      type: notification.type,
                      message: notification.message
                  };
                  
                  socket.emit('newApplication', notificationData);
              });

              // Mark notifications as delivered
              await db.Notification.update(
                  { isDelivered: true },
                  {
                      where: {
                          id: pendingNotifications.map(n => n.id)
                      }
                  }
              );
          }
      } catch (error) {
          console.error('Error handling pending notifications:', error);
      }
  });

    socket.on('disconnect', () => {
        for (let [userId, socketIds] of global.connectedUsers.entries()) {
            const index = socketIds.indexOf(socket.id);
            if (index !== -1) {
                socketIds.splice(index, 1);
                console.log(`User ${userId} disconnected, socket removed: ${socket.id}`);

                if (socketIds.length === 0) {
                    global.connectedUsers.delete(userId);
                }
                console.log('User disconnected:', userId);
                console.log('All connected users:', Array.from(global.connectedUsers.entries()));

                break;
            }
        }
    });
});

global.io = io;


app.get('/', (req, res) => {
  console.log(req.user)
    if (req.user) {
      res.send(`Hello, ${req.user.name}`);  // Access `req.user.name` or any other property
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

  app.post('/send',async(req,res)=>
  {
    const msg=req.body.msg;

    io.emit('pushnotification',{
      msg
    })
   res.status(200).send({
      msg:'message sent'
    })

    io.on('connection',
      (socket)=>
        {
          console.log('a new client connected',socket);
          socket.on('disconnect', () => {
            console.log('a client disconnected');
            });
        }
    )
  })
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  module.exports={connectedUsers}