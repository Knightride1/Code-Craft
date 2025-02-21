import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [assignmentId, setAssignmentId] = useState(null);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/submissions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ assignmentId, code, language }),
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit code.');
        }
    };

    return (
        <div className="code-editor">
            <h3 className="neon-text">Code Editor</h3>
            <select onChange={(e) => setLanguage(e.target.value)} value={language}>
                <option value="python">Python</option>
                <option value="c_cpp">C</option>
                <option value="sql">SQL</option>
            </select>
            <AceEditor
                mode={language}
                theme="monokai"
                value={code}
                onChange={setCode}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableCopy: false,
                    enablePaste: false,
                }}
                width="100%"
                height="400px"
            />
            <input
                type="text"
                placeholder="Assignment ID"
                value={assignmentId || ''}
                onChange={(e) => setAssignmentId(e.target.value)}
            />
            <button className="neon-btn" onClick={handleSubmit}>Submit Code</button>
            <button className="neon-btn" onClick={() => askLLM(code)}>Ask AI</button>
        </div>
    );
};

const askLLM = async (code) => {
    try {
        const response = await fetch('http://localhost:5000/api/llm/help', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        alert(data.suggestion);
    } catch (error) {
        console.error('LLM error:', error);
        alert('Failed to get AI help.');
    }
};

export default CodeEditor;