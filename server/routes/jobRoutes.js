const express = require('express');
const router = express.Router();
const { getJobs, getJobById, seedJobs, createJob, getMyJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/my-jobs').get(protect, getMyJobs);
router.route('/seed').post(seedJobs);
router.route('/:id').get(getJobById);

module.exports = router;
