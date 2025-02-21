const express = require('express');
const { Assignment, Course } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/random', authMiddleware, async (req, res) => {
    try {
        const assignments = await Assignment.findAll({ include: Course });
        const randomAssignment = assignments[Math.floor(Math.random() * assignments.length)];
        res.json(randomAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;