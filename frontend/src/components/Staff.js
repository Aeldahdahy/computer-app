import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModuleHeader from './ModuleHeader';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    staff_id: '',
    user_name: '',
    password: '',
    role: '',
    email: '',
    teacher_id: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const baseApi = 'http://localhost:27879/public';
  const token = localStorage.getItem('authToken');

  // Fetch all staff data
  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${baseApi}/staff`);
      setStaff(response.data.staff);
    } catch (error) {
      console.error('Error fetching staff:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or edit
  const openPopup = (staffMember = null) => {
    if (staffMember) {
      setFormData({
        staff_id: staffMember.staff_id,
        user_name: staffMember.user_name,
        password: '', // Reset password field for security
        role: staffMember.role,
        email: staffMember.email,
        teacher_id: staffMember.teacher_id || '',
      });
    } else {
      setFormData({
        staff_id: '',
        user_name: '',
        password: '',
        role: '',
        email: '',
        teacher_id: '',
      });
    }
    setPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // Validate user input
  const validateInput = () => {
    const { user_name, password, role, email } = formData;

    if (!user_name || !role || !email) {
      alert('Please fill in all required fields.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Invalid email format.');
      return false;
    }

    if (password && password.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }

    return true;
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!validateInput()) return;

    const payload = {
      staff_id: formData.staff_id || undefined, // Include only if editing
      username: formData.user_name, // Map to backend field
      password: formData.password ? formData.password : undefined, // Optional
      role: formData.role,
      email: formData.email,
      teacher_id: formData.teacher_id || null,
    };

    console.log('Payload being sent:', payload);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      if (formData.staff_id) {
        // Update existing staff
        await axios.put(`${baseApi}/staff`, payload, config);
      } else {
        // Add new staff
        await axios.post(`${baseApi}/createStaffAccount`, payload, config);
      }
      fetchStaff(); // Refresh the staff list
      closePopup();
    } catch (error) {
      console.error('Error saving staff:', error.response?.data || error.message);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (staff_id) => {
    setSelectedStaffId(staff_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle delete
  const handleDeleteStaff = async () => {
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        staff_id: selectedStaffId,
      },
    };

    try {
      await axios.delete(`${baseApi}/staff`, config);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  return (
    <div>
      <ModuleHeader ModuleName="Staff" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">
          Add New
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>User Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Teacher ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.staff_id}>
                <td>{member.staff_id}</td>
                <td>{member.user_name}</td>
                <td>{member.role}</td>
                <td>{member.email}</td>
                <td>{member.teacher_id || 'N/A'}</td>
                <td>
                  <button onClick={() => openPopup(member)} className="submitButton">
                    Edit
                  </button>
                  <button onClick={() => openDeleteConfirm(member.staff_id)} className="deleteButton">
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
        <div className="popup-overlay" onClick={closeDeleteConfirm}></div>
        <div className="popup">
          <div className="popup-header">
            <h2>{formData.staff_id ? 'Edit Staff' : 'Add Staff'}</h2>
            <button onClick={closePopup} className="closeButton">
              &times;
            </button>
          </div>
          <form onSubmit={handleFormSubmit}>
            {formData.staff_id && (
              <input
              type="hidden"
              name="staff_id"
              value={formData.staff_id}
              />
            )}
            <div className="formGroup">
              <label htmlFor="user_name">User Name</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
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
                required={!formData.staff_id} // Required only for new staff
                />
            </div>
            <div className="formGroup">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Teacher">Teacher</option>
              </select>
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
              <label htmlFor="teacher_id">Teacher ID</label>
              <input
                type="number"
                id="teacher_id"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleInputChange}
                />
            </div>
            <button type="submit" className="submitButton">
              {formData.staff_id ? 'Update' : 'Add'}
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
            <button onClick={closeDeleteConfirm} className="closeButton">
              &times;
            </button>
          </div>
          <p>Are you sure you want to delete this staff member?</p>
          <button onClick={handleDeleteStaff} className="deleteButton">
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

export default Staff;
