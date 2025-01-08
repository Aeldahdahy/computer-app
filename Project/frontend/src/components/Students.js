import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import axios from 'axios';
import { useFunctions } from '../useFunctions';
import SearchBox from './SearchBox';

function Students() {
  const { API_BASE, setError } = useFunctions();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentData, setStudentData] = useState({
    student_id: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    dob: '',
    phone_number: '',
    status: '',
    department_id: '',
  });
  const [originalStudentData, setOriginalStudentData] = useState({});

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/student`);
      const studentsWithAge = response.data.students.map(student => {
        const age = new Date().getFullYear() - new Date(student.dob).getFullYear();
        return { ...student, age };
      });
      setStudents(studentsWithAge || []);
    } catch (error) {
      setError(error.message || "Failed to fetch students");
      console.error("Error fetching students:", error.response || error.message);
    }
  }, [API_BASE, setError]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createEditStudent = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!studentData.student_id && !validateStudentInput()) return;

    const payload = { student_id: studentData.student_id }; // Ensure student_id is included
    for (const key in studentData) {
      if (studentData[key] !== originalStudentData[key]) {
        payload[key] = studentData[key];
      }
    }

    console.log('Payload being sent:', payload);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      if (studentData.student_id) {
        // Update existing student
        await axios.put(`${API_BASE}/student`, payload, config);
      } else {
        // Add new student
        await axios.post(`${API_BASE}/createStudentAccount`, payload, config);
      }
      fetchStudents(); // Refresh the student list
      closeStudentPopup();
    } catch (error) {
      console.error('Error saving student:', error.response?.data || error.message);
    }
  };

  const handleDeleteStudent = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        student_id: selectedStudentId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/student`, config);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateStudentInput = () => {
    const { fname, lname, email, password, dob, phone_number, status } = studentData;
    console.log('Validating:', studentData);

    if (!fname || !lname || !email || !status || !dob || !phone_number) {
      alert('Please fill in all required fields.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Invalid email format.');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }

    if (phone_number.length < 11) {
      alert('Phone number must be at least 11 characters.');
      return false;
    }
    return true;
  };

  const openStudentPopup = (student = null) => {
    if (student) {
      const formattedDob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
      const studentData = {
        student_id: student.student_id,
        fname: student.fname,
        lname: student.lname,
        email: student.email,
        password: '',
        dob: formattedDob,
        phone_number: student.phone_number,
        status: student.status,
        department_id: student.department_id,
      };
      setStudentData(studentData);
      setOriginalStudentData(studentData);
    } else {
      const newStudentData = {
        student_id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        dob: '',
        phone_number: '',
        status: '',
        department_id: '',
      };
      setStudentData(newStudentData);
      setOriginalStudentData(newStudentData);
    }
    setPopupOpen(true);
  };

  const openDeleteStudentConfirm = (student_id) => {
    setSelectedStudentId(student_id);
    setDeleteConfirmOpen(true);
  };

  const closeStudentPopup = () => {
    setPopupOpen(false);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayedStudents = searchResults.length > 0 ? searchResults : students;

  return (
    <div>
      <ModuleHeader ModuleName="Students" />

      <div className="module">
        <div className='module-header'>
          <button onClick={() => openStudentPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Students" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.fname} {student.lname}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>{student.phone_number}</td>
                <td>{student.status}</td>
                <td>{student.department_name || 'N/A'}</td>
                <td>
                  <button onClick={() => openStudentPopup(student)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteStudentConfirm(student.student_id)}
                    className="deleteButton"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && studentData && (
        <>
          <div className="popup-overlay" onClick={closeStudentPopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{studentData.student_id ? 'Edit Student' : 'Add Student'}</h2>
              <button onClick={closeStudentPopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditStudent}>
              <div className="formGroup">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={studentData.fname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={studentData.lname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={studentData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={studentData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={studentData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={studentData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={studentData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Under Graduate">Under Graduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div className="formGroup">
                <label htmlFor="department_id">Department ID</label>
                <input
                  type="number"
                  id="department_id"
                  name="department_id"
                  value={studentData.department_id}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="submitButton">
                {studentData.student_id ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </>
      )}

      {isDeleteConfirmOpen && (
        <>
          <div className="popup-overlay" onClick={closeDeleteConfirm}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>Confirm Delete</h2>
              <button onClick={closeDeleteConfirm} className="closeButton">
                &times;
              </button>
            </div>
            <p>Are you sure you want to delete this student?</p>
            <button onClick={handleDeleteStudent} className="deleteButton">
              Yes
            </button>
            <button onClick={closeDeleteConfirm} className="submitButton">
              No
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Students;