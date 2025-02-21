import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CourseCard from './components/CourseCard';
import './styles.css';

const App = () => {
    const [theme, setTheme] = useState('cyberpunk');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [tab, setTab] = useState('dsa');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (window.particlesJS) {
            window.particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#00ffcc' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#00ffcc', opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                    modes: { repulse: { distance: 100, duration: 0.4 } }
                }
            });
        }
        loadCourses();
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUser(data);
                loadEnrolledCourses();
            }
        }
    };

    const loadCourses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/courses');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    const loadEnrolledCourses = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/courses/enrolled', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const enrolled = await response.json();
            enrolled.forEach(course => updateCourseButton(course.name));
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            loadCourses();
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/courses/search?query=${searchTerm}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const toggleTabs = () => {
        const tabs = document.getElementById('codingSkillsTabs');
        tabs.style.display = tabs.style.display === 'none' ? 'block' : 'none';
        if (tabs.style.display === 'block') setTab('dsa');
    };

    const showTab = async (tabId) => {
        setTab(tabId);
        try {
            const response = await fetch(`http://localhost:5000/api/courses/category/${tabId.toUpperCase()}`);
            const data = await response.json();
            setCourses(data.filter(course => course.category.toLowerCase() === tabId));
        } catch (error) {
            console.error(`Error loading ${tabId} courses:`, error);
        }
    };

    const updateCourseButton = (courseName) => {
        const button = document.querySelector(`#course-${courseName} .neon-btn`);
        if (button) {
            button.textContent = 'Enrolled';
            button.disabled = true;
            button.classList.add('enrolled');
        }
    };

    return (
        <div className={`app ${theme}`}>
            <nav className="nav-bar">
                <div className="logo neon-text" onClick={() => document.getElementById('main-header').scrollIntoView({ behavior: 'smooth' })}>CodeCraft</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search hackathon skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearch} />
                </div>
                <div className="auth-buttons">
                    <button className="business-btn" onClick={toggleTabs}>CodeCraft For Coding Skills</button>
                    {!isLoggedIn && <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>}
                    {!isLoggedIn && <button className="register-btn" onClick={() => setShowRegister(true)}>Register for free</button>}
                    {isLoggedIn && <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); setUser(null); }}>Logout</button>}
                    <select onChange={(e) => setTheme(e.target.value)} value={theme}>
                        <option value="cyberpunk">Cyberpunk</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </nav>

            <div className="tabs" id="codingSkillsTabs">
                <div className="tab-buttons">
                    <button className={`tab-btn neon-text ${tab === 'dsa' ? 'active' : ''}`} onClick={() => showTab('dsa')}>DSA</button>
                    <button className={`tab-btn neon-text ${tab === 'java' ? 'active' : ''}`} onClick={() => showTab('java')}>JAVA</button>
                    <button className={`tab-btn neon-text ${tab === 'python' ? 'active' : ''}`} onClick={() => showTab('python')}>PYTHON</button>
                    <button className={`tab-btn neon-text ${tab === 'web' ? 'active' : ''}`} onClick={() => showTab('web')}>WEB</button>
                </div>
                <div className="tab-content">
                    {courses.filter(course => course.category.toLowerCase() === tab).map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>

            <header className="main-header" id="main-header">
                <div className="breadcrumb neon-text">Home > CodeCraft</div>
                <h1 className="neon-text">Code Craft: Hackathon Programs</h1>
            </header>

            <section className="content">
                <p>Learn coding techniques, problem-solving strategies, and teamwork for hackathons.</p>
                <div className="course-section">
                    <h2 className="neon-text">Available Courses</h2>
                    {courses.filter(course => course.category === 'General').map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                {isLoggedIn && <CodeEditor />}
            </section>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
            {showRegister && <RegisterModal onClose={() => setShowRegister(false)} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        </div>
    );
};

export default App;