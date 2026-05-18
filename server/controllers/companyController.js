const Company = require('../models/Company');
const companiesData = require('../data/companiesSeedData');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
    try {
        const { keyword, location, industry, size } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { techStack: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (location) query.location = { $regex: location, $options: 'i' };
        if (industry) query.industry = { $regex: industry, $options: 'i' };
        if (size) query.companySize = size;

        const companies = await Company.find(query);
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed preliminary companies
// @route   POST /api/companies/seed
// @access  Public
const seedCompanies = async (req, res) => {
    try {
        await Company.deleteMany(); // Clear existing

        const companies = companiesData;

        await Company.insertMany(companies);
        res.json({ message: 'Companies seeded successfully', count: companies.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getCompanies, getCompanyById, createCompany, seedCompanies };
