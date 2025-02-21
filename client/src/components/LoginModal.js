import React, { useState } from 'react';

const LoginModal = ({ onClose, setIsLoggedIn, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setUser(data.user);
                onClose();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Login error');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2 className="neon-text">Login to Code Craft</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                    <p>Not registered? <span className="neon-text" onClick={onClose}>Register here</span></p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;