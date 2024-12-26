import React, { useState } from 'react';
import ModuleHeader from './ModuleHeader';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    teacher_id: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone_number: '',
    status: '',
    department_id: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or edit
  const openPopup = (teacher = null) => {
    if (teacher) {
      setFormData(teacher);
    } else {
      setFormData({
        teacher_id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        phone_number: '',
        status: '',
        department_id: '',
      });
    }
    setPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.teacher_id) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.teacher_id === formData.teacher_id ? formData : teacher
        )
      );
    } else {
      setTeachers([...teachers, { ...formData, teacher_id: Date.now().toString() }]);
    }
    closePopup();
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (teacher_id) => {
    setSelectedTeacherId(teacher_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle delete
  const handleDeleteTeacher = () => {
    setTeachers(teachers.filter((teacher) => teacher.teacher_id !== selectedTeacherId));
    closeDeleteConfirm();
  };

  return (
    <div>
      <ModuleHeader ModuleName="Teachers" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">
          Add New
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Department ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.fname}</td>
                <td>{teacher.lname}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone_number}</td>
                <td>{teacher.status}</td>
                <td>{teacher.department_id || 'N/A'}</td>
                <td>
                  <button onClick={() => openPopup(teacher)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(teacher.teacher_id)}
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

      {/* Popup Form */}
      {isPopupOpen && (
        <>
          <div className="popup-overlay" onClick={closePopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{formData.teacher_id ? 'Edit Teacher' : 'Add Teacher'}</h2>
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
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
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
                  value={formData.department_id}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="submitButton">
                {formData.teacher_id ? 'Update' : 'Add'}
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
