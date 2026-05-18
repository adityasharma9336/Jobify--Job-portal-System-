const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.post('/seed', companyController.seedCompanies);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.post('/', companyController.createCompany);

module.exports = router;
