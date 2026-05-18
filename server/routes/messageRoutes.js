const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(sendMessage).get(getConversations);
router.route('/:userId').get(getMessages);

module.exports = router;
