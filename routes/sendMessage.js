const express = require('express');
const messageController = require('../controllers/sendMessage');
const router = express.Router();


router.post('/sendMessage', messageController.createMessage);
router.get('/sendMessages', messageController.getMessages);
router.get('/sendMessage/:messageId', messageController.getSingleMessage);
router.delete('/sendMessage/:messageId', messageController.deleteMessage);


module.exports = router;