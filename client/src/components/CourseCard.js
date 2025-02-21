import React from 'react';

const CourseCard = ({ course }) => {
    const enrollCourse = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to enroll.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/courses/enroll/${course.name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                document.querySelector(`#course-${course.name} .neon-btn`).textContent = 'Enrolled';
                document.querySelector(`#course-${course.name} .neon-btn`).disabled = true;
                document.querySelector(`#course-${course.name} .neon-btn`).classList.add('enrolled');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Enrollment error');
        }
    };

    const stars = '★'.repeat(course.rating) + '☆'.repeat(5 - course.rating);
    return (
        <div className="course-card" id={`course-${course.name}`}>
            <div className="image-placeholder"></div>
            <div>
                <h3 className="neon-text">{course.name}</h3>
                <div className="rating">{stars}</div>
                <p>{course.description}</p>
                <button className="neon-btn" onClick={enrollCourse}>Enroll Now</button>
            </div>
        </div>
    );
};

export default CourseCard;