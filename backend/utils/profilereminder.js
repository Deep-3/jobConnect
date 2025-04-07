const cron = require('node-cron');
const db=require('../models')

exports.profilereminer=(UserId)=>{
    cron.schedule('33 13 * * *', ()=> {
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
