import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

const myElement = <div className="main-container">
<div className="sidebar-left">
    <div className="home-button">
        <a href="index.js" className="app-logomark">
            <span className="screenreader-only">Home</span>
        </a>
    </div>

    <div className="navigation-buttons">
        <a href="teacherHome.html" className="teacher-button"> Teacher Page </a>
        <a href="studentHome.html" className="student-button"> Student Page</a>
    </div>
</div>

</div>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(myElement);