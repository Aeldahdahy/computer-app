import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import axios from 'axios';
import { useFunctions } from '../useFunctions';
import SearchBox from './SearchBox';

function Teachers() {
  const { API_BASE, setError } = useFunctions();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teacherData, setTeacherData] = useState({
    teacher_id: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone_number: '',
    status: '',
    department_id: '',
  });
  const [originalTeacherData, setOriginalTeacherData] = useState({});

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/teacher`);
      setTeachers(response.data.teachers);
    } catch (error) {
      setError(error.message || "Failed to fetch teachers");
      console.error("Error fetching teachers:", error.response || error.message);
    }
  }, [API_BASE, setError]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const createEditTeacher = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!teacherData.teacher_id && !validateTeacherInput()) return;

    const payload = { teacher_id: teacherData.teacher_id }; // Ensure teacher_id is included
    for (const key in teacherData) {
      if (teacherData[key] !== originalTeacherData[key]) {
        payload[key] = teacherData[key];
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
      if (teacherData.teacher_id) {
        // Update existing teacher
        await axios.put(`${API_BASE}/teacher`, payload, config);
      } else {
        // Add new teacher
        await axios.post(`${API_BASE}/teacher`, payload, config);
      }
      fetchTeachers(); // Refresh the teacher list
      closeTeacherPopup();
    } catch (error) {
      console.error('Error saving teacher:', error.response?.data || error.message);
    }
  };

  const handleDeleteTeacher = async () => {
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
        teacher_id: selectedTeacherId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/teacher`, config);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateTeacherInput = () => {
    const { fname, lname, email, password, phone_number, status } = teacherData;
    console.log('Validating:', teacherData);

    if (!fname || !lname || !email || !status) {
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

  const openTeacherPopup = (teacher = null) => {
    if (teacher) {
      const [fname, lname] = teacher.full_name.split(' ');
      const teacherData = {
        teacher_id: teacher.teacher_id,
        fname: fname,
        lname: lname,
        email: teacher.email,
        password: '',
        phone_number: teacher.phone_number,
        status: teacher.status,
        department_id: teacher.department_id,
      };
      setTeacherData(teacherData);
      setOriginalTeacherData(teacherData);
    } else {
      const newTeacherData = {
        teacher_id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        phone_number: '',
        status: '',
        department_id: '',
      };
      setTeacherData(newTeacherData);
      setOriginalTeacherData(newTeacherData);
    }
    setPopupOpen(true);
  };

  const openDeleteTeacherConfirm = (teacher_id) => {
    setSelectedTeacherId(teacher_id);
    setDeleteConfirmOpen(true);
  };

  const closeTeacherPopup = () => {
    setPopupOpen(false);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({ ...teacherData, [name]: value });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayedTeachers = searchResults.length > 0 ? searchResults : teachers;

  return (
    <div>
      <ModuleHeader ModuleName="Teachers" />

      <div className="module">
        <div className='module-header'>
          <button onClick={() => openTeacherPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Teachers" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTeachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.full_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone_number}</td>
                <td>{teacher.status}</td>
                <td>{teacher.department_name || 'N/A'}</td>
                <td>
                  <button onClick={() => openTeacherPopup(teacher)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteTeacherConfirm(teacher.teacher_id)}
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

      {isPopupOpen && teacherData && (
        <>
          <div className="popup-overlay" onClick={closeTeacherPopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{teacherData.teacher_id ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button onClick={closeTeacherPopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditTeacher}>
              <div className="formGroup">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={teacherData.fname}
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
                  value={teacherData.lname}
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
                  value={teacherData.email}
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
                  value={teacherData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={teacherData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={teacherData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>
              <div className="formGroup">
                <label htmlFor="department_id">Department ID</label>
                <input
                  type="number"
                  id="department_id"
                  name="department_id"
                  value={teacherData.department_id}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="submitButton">
                {teacherData.teacher_id ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete this teacher?</p>
            <button onClick={handleDeleteTeacher} className="deleteButton">
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

export default Teachers;