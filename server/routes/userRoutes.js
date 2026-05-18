const express = require('express');
const router = express.Router();
const { toggleSavedJob, getSavedJobs, toggleFollowCompany, getFollowedCompanies, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/saved-jobs')
    .post(toggleSavedJob)
    .get(getSavedJobs);

router.route('/followed-companies')
    .post(toggleFollowCompany)
    .get(getFollowedCompanies);

router.route('/:id').get(getUserById);

module.exports = router;
