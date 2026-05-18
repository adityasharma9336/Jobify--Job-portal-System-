const express = require('express');
const router = express.Router();
const { getRecentActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getRecentActivity);

module.exports = router;
