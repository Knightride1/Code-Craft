const { sequelize, Course, Assignment } = require('./models');
const { connectDB } = require('./config/db');

const seedDB = async () => {
    await connectDB();
    await sequelize.sync({ force: true });

    await Course.bulkCreate([
        { name: 'CodeCraftX', description: 'Introduction to Hackathon Programming', rating: 5, category: 'General' },
        { name: 'CodeCraftDSA', description: 'Data Structures and Algorithms', rating: 4, category: 'DSA' },
        { name: 'CodeCraftPYTHON', description: 'Python for Hackathons', rating: 5, category: 'PYTHON' },
    ]);

    await Assignment.bulkCreate([
        {
            courseId: 1,
            title: 'Hello World',
            description: 'Print "Hello, World!"',
            language: 'python',
            testCases: [{ input: '', expectedOutput: 'Hello, World!' }],
        },
        {
            courseId: 2,
            title: 'Array Sum',
            description: 'Sum an array',
            language: 'c_cpp',
            testCases: [{ input: '1 2 3', expectedOutput: '6' }],
        },
    ]);

    console.log('Database seeded');
    process.exit();
};

seedDB();