const express = require('express');
const { Course, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const courses = await Course.findAll({ where: { category: 'General' } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        const courses = await Course.findAll({ where: { category: req.params.category.toUpperCase() } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const courses = await Course.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { name: { [require('sequelize').Op.iLike]: `%${query}%` } },
                    { description: { [require('sequelize').Op.iLike]: `%${query}%` } },
                ],
            },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/enroll/:courseName', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Course });
        const course = await Course.findOne({ where: { name: req.params.courseName } });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const isEnrolled = user.Courses.some(c => c.id === course.id);
        if (isEnrolled) return res.status(400).json({ message: 'Already enrolled' });

        await user.addCourse(course);
        user.points += 10;
        const enrolledCount = (await user.getCourses()).length;
        if (enrolledCount >= 3 && !user.badges.includes('Hackathon Enthusiast')) {
            user.badges = [...user.badges, 'Hackathon Enthusiast'];
        }
        await user.save();

        res.json({ message: `Enrolled in ${course.name}`, points: user.points, badges: user.badges });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/enrolled', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Course });
        res.json(user.Courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;