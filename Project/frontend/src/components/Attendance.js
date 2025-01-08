import React, { useState } from 'react';
import { Pen, X } from 'lucide-react';  // Import Pen and X icons from lucide-react
import ModuleHeader from './ModuleHeader';

const courses = [
  { id: 1, name: 'Math' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'History' }
];

const classes = {
  1: ['9:00 AM', '11:00 AM'],
  2: ['10:00 AM', '1:00 PM'],
  3: ['8:00 AM', '12:00 PM']
};

const students = {
  '9:00 AM': [
    { id: 'S1', name: 'Alice', image: 'https://via.placeholder.com/140x200' },
    { id: 'S2', name: 'Bob', image: 'https://via.placeholder.com/140x200' }
  ],
  '11:00 AM': [
    { id: 'S3', name: 'Charlie', image: 'https://via.placeholder.com/140x200' },
    { id: 'S4', name: 'David', image: '' }
  ],
  '10:00 AM': [
    { id: 'S5', name: 'Eve', image: 'https://via.placeholder.com/140x200' },
    { id: 'S6', name: 'Frank', image: '' }
  ],
  '1:00 PM': [
    { id: 'S7', name: 'Grace', image: 'https://via.placeholder.com/140x200' },
    { id: 'S8', name: 'Heidi', image: '' }
  ],
  '8:00 AM': [
    { id: 'S9', name: 'Ivan', image: 'https://via.placeholder.com/140x200' },
    { id: 'S10', name: 'Judy', image: '' }
  ],
  '12:00 PM': [
    { id: 'S11', name: 'Mallory', image: 'https://via.placeholder.com/140x200' },
    { id: 'S12', name: 'Niaj', image: '' }
  ]
};

function Attendance() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClassTime, setSelectedClassTime] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [excuse, setExcuse] = useState({});
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [selectedStudentForExcuse, setSelectedStudentForExcuse] = useState(null);

  const handleAttendanceToggle = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === 'Attended' ? 'Absent' : 'Attended'
    }));
  };

  const handleExcuseToggle = (id) => {
    setSelectedStudentForExcuse(id);
    setIsExcuseModalOpen(true);
  };

  const handleExcuseSubmit = () => {
    if (selectedStudentForExcuse && excuse[selectedStudentForExcuse]) {
      alert(`Excuse for ${selectedStudentForExcuse}: ${excuse[selectedStudentForExcuse]}`);
    }
    setIsExcuseModalOpen(false);
  };

  const handleExcuseChange = (event) => {
    setExcuse((prev) => ({
      ...prev,
      [selectedStudentForExcuse]: event.target.value
    }));
  };

  const resetSelection = () => {
    setSelectedCourse(null);
    setSelectedClassTime(null);
  };

  const goBack = () => {
    if (selectedClassTime) setSelectedClassTime(null);
    else resetSelection();
  };

  const closeExcuseModal = () => {
    setIsExcuseModalOpen(false);
  };

  return (
    <div className="attendance-container">
      <ModuleHeader ModuleName="Attendance" />

      {(selectedCourse || selectedClassTime) && (
        <button className="back-button" onClick={goBack}>
          Back
        </button>
      )}

      {!selectedCourse && (
        <div className="selection-container">
          <h2>Select Course</h2>
          <div className="selection-grid">
            {courses.map(course => (
              <button
                key={course.id}
                className="selection-button"
                onClick={() => setSelectedCourse(course.id)}
              >
                {course.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCourse && !selectedClassTime && (
        <div className="selection-container">
          <h2>Select Class Time</h2>
          <div className="selection-grid">
            {classes[selectedCourse].map(time => (
              <button
                key={time}
                className="selection-button"
                onClick={() => setSelectedClassTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedClassTime && (
        <div className="students-container">
          <h2>Students Enrolled</h2>
          <div className="student-cards">
            {students[selectedClassTime].map(student => (
              <div key={student.id} className="student-card">
                <div className="student-image">
                  {student.image ? (
                    <img src={student.image} alt={student.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <h3>{student.name}</h3>
                <p>ID: {student.id}</p>
                <button
                  className={`status-button ${
                    attendance[student.id] === 'Attended' ? 'attended' : attendance[student.id] === 'Excused' ? 'excused' : 'absent'
                  }`}
                  onClick={() => handleAttendanceToggle(student.id)}
                >
                  {attendance[student.id] === 'Attended' ? 'Attended' : attendance[student.id] === 'Excused' ? 'Excused' : 'Absent'}
                </button>
                {attendance[student.id] !== 'Attended' && (
                  <button
                    className="excuse-button"
                    onClick={() => handleExcuseToggle(student.id)}
                  >
                    <Pen size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Excuse Modal */}
      {isExcuseModalOpen && (
        <div className="excuse-modal" onClick={closeExcuseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeExcuseModal}>
              <X size={16} />
            </button>
            <h3>Enter Excuse for {students[selectedClassTime]?.find(s => s.id === selectedStudentForExcuse)?.name}</h3>
            <textarea
              value={excuse[selectedStudentForExcuse] || ''}
              onChange={handleExcuseChange}
              placeholder="Enter the reason for absence..."
            />
            <button onClick={handleExcuseSubmit}>Submit Excuse</button>
            <button onClick={closeExcuseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
