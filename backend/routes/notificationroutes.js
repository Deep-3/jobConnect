const express = require('express');
const notificationController = require('../controllers/notificationcontroller');
const router = express.Router();

router.get('/:userId',notificationController.getNotifications)

router.put('/:id/read',notificationController.markNotificationRead)

router.put('/mark-all-read',notificationController.markAllNotificationsRead)

module.exports=router;


