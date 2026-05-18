const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contacts
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const newContact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ success: true, data: newContact });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
