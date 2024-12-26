import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import SignInForm from './components/SignInForm';
import Dashboard from './components/Dashboard';
import Main from './components/Main';
import Staff from './components/Staff';
import Teachers from './components/Teachers';
import Students from './components/Students';
import Departments from './components/Departments';
import Courses from './components/Courses';
import Classes from './components/Classes';
import Attendance from './components/Attendance';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignInForm />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path="" element={<Main />} />
            <Route path="staff" element={<Staff />} />
            <Route path="teacher" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="departments" element={<Departments />} />
            <Route path="courses" element={<Courses />} />
            <Route path="class" element={<Classes />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
