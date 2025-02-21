const db=require('../models');

exports.getNotifications = async (req, res) => {
    try {
        // Verify user authorization
        if (req.user.id !== parseInt(req.params.userId)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const notifications = await db.Notification.findAll({
            where: {
                userId: req.params.userId,
                isRead:false
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ 
            success: true,
            notifications: notifications.map(notif => ({
                id: notif.id,
                data: notif.data,
                isRead: notif.isRead,
                createdAt: notif.createdAt,
                type: notif.type,
                message: notif.message
            }))
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await db.Notification.findByPk(req.params.id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        if (notification.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        await notification.update({ isRead: true });

        const removenotification = await db.Notification.destroy({where:{
            id:notification.id,
        }});
        
        res.json({ 
            success: true,
            message: 'Notification marked as read' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

exports.markAllNotificationsRead = async (req, res) => {
    try {
        await db.Notification.update(
            { isRead: true },
            {
                where: {
                    userId: req.user.id,
                    isRead: false
                }
            }
        );


        const removenotification = await db.Notification.destroy({where:{
            userId:req.user.id,
        }});
        // Emit to all user's connected sockets
        const userSockets = global.connectedUsers.get(req.user.id);
        if (userSockets) {
            userSockets.forEach(socketId => {
                global.io.to(socketId).emit('allNotificationsRead');
            });
        }

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark all notifications as read'
        });
    }
};

exports.getPendingNotifications = async (req, res) => {
    try {
        const pendingNotifications = await db.Notification.findAll({
            where: {
                userId: req.user.id,
                isDelivered: false
            },
            order: [['createdAt', 'DESC']]
        });

        if (pendingNotifications.length > 0) {
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

        res.status(200).json({
            success: true,
            data: pendingNotifications
        });
    } catch (error) {
        console.error('Error fetching pending notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending notifications'
        });
    }
};
