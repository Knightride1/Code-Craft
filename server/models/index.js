const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Course = require('./Course');
const Assignment = require('./Assignment');
const Submission = require('./Submission');

User.belongsToMany(Course, { through: 'UserCourses', foreignKey: 'userId' });
Course.belongsToMany(User, { through: 'UserCourses', foreignKey: 'courseId' });
Assignment.belongsTo(Course, { foreignKey: 'courseId' });
Submission.belongsTo(User, { foreignKey: 'userId' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });

module.exports = { sequelize, User, Course, Assignment, Submission };