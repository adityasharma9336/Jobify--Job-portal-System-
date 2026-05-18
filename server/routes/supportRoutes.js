const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/supportController');

router.route('/chat').post(handleChatMessage);

module.exports = router;
