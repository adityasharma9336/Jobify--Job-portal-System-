const express = require('express');
const router = express.Router();
const { getTips, getTipById } = require('../controllers/tipController');

router.route('/').get(getTips);
router.route('/:id').get(getTipById);

module.exports = router;
