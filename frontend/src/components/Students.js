import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModuleHeader from './ModuleHeader';

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    dob: '',
    phone_number: '',
    department_id: '',
    status: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const API_BASE_URL = 'http://localhost:27879/public';

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error.response?.data || error.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open form for Add or Edit
  const openPopup = (student = null) => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        student_id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        dob: '',
        phone_number: '',
        department_id: '',
        status: '',
      });
    }
    setPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.student_id) {
        await axios.put(`${API_BASE_URL}/student/${formData.student_id}`, formData);
        alert('Student updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/createStudentAccount`, formData);
        alert('Student added successfully');
      }
      fetchStudents();
      closePopup();
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (student_id) => {
    setSelectedStudentId(student_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle student deletion
  const handleDeleteStudent = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/student/${selectedStudentId}`);
      alert('Student deleted successfully');
      fetchStudents();
      closeDeleteConfirm();
    } catch (error) {
      console.error('Error deleting student:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <ModuleHeader ModuleName="Students" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">Add New</button>

        {/* Table to display student data */}
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Department ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.student_id}</td>
                <td>{`${student.fname} ${student.lname}`}</td>
                <td>{student.email}</td>
                <td>{student.dob}</td>
                <td>{student.phone_number}</td>
                <td>{student.status}</td>
                <td>{student.department_id || 'N/A'}</td>
                <td>
                  <button onClick={() => openPopup(student)} className="submitButton">Edit</button>
                  <button onClick={() => openDeleteConfirm(student.student_id)} className="deleteButton">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <>
          <div className="popup-overlay" onClick={closePopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{formData.student_id ? 'Edit Student' : 'Add Student'}</h2>
              <button onClick={closePopup} className="closeButton">&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="formGroup">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
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
                  value={formData.lname}
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
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="number"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="department_id">Department ID</label>
                <input
                  type="number"
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Under Graduate">Under Graduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <button type="submit" className="submitButton">
                {formData.student_id ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <>
          <div className="popup-overlay" onClick={closeDeleteConfirm}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>Confirm Delete</h2>
              <button onClick={closeDeleteConfirm} className="closeButton">&times;</button>
            </div>
            <p>Are you sure you want to delete this student?</p>
            <button onClick={handleDeleteStudent} className="deleteButton">Yes</button>
            <button onClick={closeDeleteConfirm} className="submitButton">No</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Students;
