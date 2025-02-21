const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Submission = sequelize.define('Submission', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    assignmentId: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.TEXT, allowNull: false },
    language: { type: DataTypes.STRING, allowNull: false },
    grade: { type: DataTypes.INTEGER, defaultValue: null },
    feedback: { type: DataTypes.STRING, defaultValue: null },
}, { tableName: 'submissions', timestamps: true });

module.exports = Submission;