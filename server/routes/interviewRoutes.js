const express = require('express');
const router = express.Router();
const { getMyInterviews, scheduleInterview, getEmployerInterviews } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMyInterviews)
    .post(protect, scheduleInterview);

router.route('/employer')
    .get(protect, getEmployerInterviews);

module.exports = router;
