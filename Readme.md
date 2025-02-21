Code-Craft

Code-Craft is an innovative educational platform designed to revolutionize coding education for college students and professors. Built for a hackathon, it surpasses traditional tools like Google Classroom and Moodle by offering an integrated online code editor, automated assignment generation, submission, and grading, all wrapped in a sleek Cyberpunk-themed UI. With AI assistance, gamification, and robust security, Code-Craft is the ultimate tool for mastering coding skills.
Features

    Online Code Editor:
        Supports C, Python, SQL, and more.
        Copy-paste disabled to prevent cheating.
        Automated testing and grading inspired by CS50’s check50.
    Automated Assignment System:
        Randomly generates unique questions per student.
        Submissions stored securely with plagiarism checks.
        Auto-grading with test cases (e.g., input/output validation).
    AI Integration:
        Lightweight LLM (simulated) for coding help and debugging hints.
        Showcase-ready for hackathon judges.
    Frontend Design:
        Cyberpunk theme with switchable options (Dark, Light).
        Intuitive UX for student engagement.
    Gamification:
        Points for submissions (e.g., 10 per enrollment, grading-based).
        Badges like "Hackathon Enthusiast" for milestones.
        Leaderboard potential (future scope).
    Security:
        JWT authentication, AES-256 encrypted code submissions.
        Rate limiting and anti-cheat mechanisms.
    Deployment:
        Hosted on Azure Static Web Apps (frontend) and Azure App Service (backend).
        PostgreSQL database on Azure for scalability.

Project Structure
                                                                                                                
codecraft/
├── client/                   # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── particles.min.js  # Particles.js for Cyberpunk effect
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.js
│   │   │   ├── LoginModal.js
│   │   │   ├── RegisterModal.js
│   │   │   └── CourseCard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
├── server/                   # Node.js/Express Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── assignments.js
│   │   └── submissions.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── README.md                 # This file
Prerequisites

    Node.js: v18.x or higher (Download).
    PostgreSQL: v15.x or higher (Download).
    Azure CLI: For deployment (Download).
    Git: For cloning and deployment (Download).
