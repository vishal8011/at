// src/MainRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import AddStudent from './addstudent';
import StudentList from './Stu';
import AttendancePage from './AttendancePage';
import CheckStudent from './CheckStudent';
import StudentAttendance from './StudentAttendance'; // ✅ New Component
// import MusicBars from './MusicBars';


const MainRoutes = () => {
    return (
        <>
            {/* Optional global background */}
            {/* <MusicBars /> */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/check-student" element={<CheckStudent />} />
                <Route path="/student-attendance/:id" element={<StudentAttendance />} />
            </Routes>
        </>
    );
};

export default MainRoutes;
