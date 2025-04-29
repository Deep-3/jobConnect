const cron = require('node-cron');
const db=require('../models')
const { Op } = require('sequelize');
const admin=require('../utils/pushnotifications/firebase');
const notification = require('../models/notification');

exports.profilereminer=(UserId)=>{
    cron.schedule('54 15 * * *', ()=> {
        const userSockets = global.connectedUsers.get(UserId);
        if (userSockets) {
            console.log('Found sockets for user:', userSockets); // Debug log
            
            userSockets.forEach(socketId => {
                console.log("Sending reminder to socket:", socketId);
                global.io.to(socketId).emit('profilereminder', {
                    userId: UserId,
                    message: 'Please complete your profile'
                });
            });
        } else {
            console.log('No sockets found for user:', UserId);
        }
      });
}

cron.schedule("15 10 * * *",async()=>{

    
    try
    {
        const users = await db.User.findAll({
        where: {
            fcmtoken: {
                [Op.ne]: null,
            }
        },
        attributes: ['fcmtoken']
    });
    console.log(users)
      
    const messages = users.map(user => ({
        notification: {
            title: "Dream Job",
            body: "find your dream job in jobconnect"
        },
        token: user.dataValues.fcmtoken
    }));

    
        // Send notifications using sendEach
        const response = await admin.messaging().sendEach(messages);
        
        console.log('Notification Results:', {
            success: response.successCount,
            failure: response.failureCount,
            total: messages.length
        });

    
    }
    catch(error)
    {
       console.log(error)
    }
})

module.exports=cron;
