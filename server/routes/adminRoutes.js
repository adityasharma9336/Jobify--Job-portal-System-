const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getStats,
    getUsers,
    deleteUser,
    updateUserStatus,
    getJobs,
    deleteJob,
    getCompanies,
    deleteCompany,
    getApplications,
    updateApplicationStatus,
    scheduleInterview,
    getInterviews
} = require('../controllers/adminController');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.patch('/users/:id/status', protect, adminOnly, updateUserStatus);
router.get('/jobs', protect, adminOnly, getJobs);
router.delete('/jobs/:id', protect, adminOnly, deleteJob);
router.get('/companies', protect, adminOnly, getCompanies);
router.delete('/companies/:id', protect, adminOnly, deleteCompany);
router.get('/applications', protect, adminOnly, getApplications);
router.patch('/applications/:id/status', protect, adminOnly, updateApplicationStatus);
router.get('/interviews', protect, adminOnly, getInterviews);
router.post('/interviews', protect, adminOnly, scheduleInterview);

module.exports = router;
