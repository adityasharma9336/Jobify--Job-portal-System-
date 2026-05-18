const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getApplicationStats, getEmployerApplications, getEmployerStats, updateEmployerApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(applyForJob).get(getMyApplications);
router.route('/stats').get(getApplicationStats);

// Employer specific routes
router.route('/employer').get(getEmployerApplications);
router.route('/employer/:id/status').patch(updateEmployerApplicationStatus);
router.route('/employer/stats').get(getEmployerStats);

module.exports = router;
