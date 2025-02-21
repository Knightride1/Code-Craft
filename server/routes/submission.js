const express = require('express');
const { Submission, Assignment, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { exec } = require('child_process');
const router = express.Router();
const { AES, enc } = require('crypto-js');

router.post('/submit', authMiddleware, async (req, res) => {
    const { assignmentId, code, language } = req.body;
    try {
        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Encrypt code
        const encryptedCode = AES.encrypt(code, process.env.ENCRYPTION_KEY).toString();

        // Plagiarism check (simple hash comparison)
        const existingSubmissions = await Submission.findAll({ where: { assignmentId } });
        const codeHash = require('crypto').createHash('md5').update(code).digest('hex');
        if (existingSubmissions.some(sub => require('crypto').createHash('md5').update(AES.decrypt(sub.code, process.env.ENCRYPTION_KEY).toString(enc.Utf8)).digest('hex') === codeHash)) {
            return res.status(400).json({ message: 'Plagiarism detected' });
        }

        const submission = await Submission.create({
            userId: req.user.id,
            assignmentId,
            code: encryptedCode,
            language,
        });

        // Automated grading
        const grade = await gradeSubmission(code, assignment.testCases, language);
        submission.grade = grade.score;
        submission.feedback = grade.feedback;
        await submission.save();

        const user = await User.findByPk(req.user.id);
        user.points += grade.score;
        await user.save();

        res.json({ message: 'Submission successful', grade: grade.score, feedback: grade.feedback });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const gradeSubmission = async (code, testCases, language) => {
    const decryptedCode = AES.decrypt(code, process.env.ENCRYPTION_KEY).toString(enc.Utf8);
    let score = 0;
    let feedback = '';

    for (const test of testCases) {
        const result = await runCode(decryptedCode, test.input, language);
        if (result.output.trim() === test.expectedOutput.trim()) {
            score += 10;
            feedback += `Test passed: ${test.input} -> ${test.expectedOutput}\n`;
        } else {
            feedback += `Test failed: ${test.input} -> Expected ${test.expectedOutput}, got ${result.output}\n`;
        }
    }

    return { score, feedback };
};

const runCode = (code, input, language) => {
    return new Promise((resolve) => {
        let command;
        if (language === 'python') command = `echo "${code}" | python3 -c "import sys; sys.stdin = open(0); ${input}"`;
        else if (language === 'c_cpp') command = `echo "${code}" | gcc -x c -o test - && echo "${input}" | ./test`;
        else if (language === 'sql') command = `psql -d codecraft -c "${code}"`; // Simplified SQL execution

        exec(command, (error, stdout, stderr) => {
            if (error) resolve({ output: stderr });
            else resolve({ output: stdout });
        });
    });
};

// LLM Integration
router.post('/llm/help', async (req, res) => {
    const { code } = req.body;
    try {
        const suggestion = await getLLMSuggestion(code); // Simulated LLM call
        res.json({ suggestion });
    } catch (error) {
        res.status(500).json({ message: 'LLM error', error: error.message });
    }
});

const getLLMSuggestion = async (code) => {
    // Simulated lightweight LLM (replace with Ollama integration if available)
    return `Try optimizing this code: ${code.slice(0, 50)}...`;
};

module.exports = router;