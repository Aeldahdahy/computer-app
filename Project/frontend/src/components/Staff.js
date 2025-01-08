import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import SearchBox from './SearchBox';
import axios from 'axios';
import { useFunctions } from '../useFunctions';

function Staff() {
  const { API_BASE } = useFunctions();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [staffData, setStaffData] = useState({
    staff_id: '',
    user_name: '',
    password: '',
    role: '',
    email: '',
    teacher_id: '',
  });

  const fetchStaff = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found.');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(response.data.staff);
    } catch (error) {
      console.error('Error fetching staff:', error.message || error.response);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createEditStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!validateInput()) return;

    const payload = {
      staff_id: staffData.staff_id || undefined,
      username: staffData.user_name,
      password: staffData.password ? staffData.password : undefined,
      role: staffData.role,
      email: staffData.email,
      teacher_id: staffData.teacher_id || null,
    };

    console.log('Payload being sent:', payload);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      if (staffData.staff_id) {
        await axios.put(`${API_BASE}/staff`, payload, config);
      } else {
        await axios.post(`${API_BASE}/createStaffAccount`, payload, config);
      }
      fetchStaff();
      closeStaffPopup();
    } catch (error) {
      console.error('Error saving staff:', error.response?.data || error.message);
    }
  };

  const handleDeleteStaff = async () => {
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
        staff_id: selectedStaffId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/staff`, config);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateInput = () => {
    const { user_name, password, role, email } = staffData;
    console.log('Validating:', staffData);

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

  const openStaffPopup = (staffMember = null) => {
    if (staffMember) {
      setStaffData({
        staff_id: staffMember.staff_id,
        user_name: staffMember.user_name,
        password: '',
        role: staffMember.role,
        email: staffMember.email,
        teacher_id: staffMember.teacher_id || '',
      });
    } else {
      setStaffData({
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

  const openDeleteStaffConfirm = (staff_id) => {
    setSelectedStaffId(staff_id);
    setDeleteConfirmOpen(true);
  };

  const closeStaffPopup = () => {
    setPopupOpen(false);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayedStaff = searchResults.length > 0 ? searchResults : staff;

  return (
    <div>
      <ModuleHeader ModuleName="Staff" />
      <div className="module">
        <div className='module-header'>
          <button onClick={() => openStaffPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Staff" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Teacher ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStaff.map((staffMember) => (
              <tr key={staffMember.staff_id}>
                <td>{staffMember.staff_id}</td>
                <td>{staffMember.user_name}</td>
                <td>{staffMember.email}</td>
                <td>{staffMember.role}</td>
                <td>{staffMember.teacher_id || 'N/A'}</td>
                <td>
                  <button onClick={() => openStaffPopup(staffMember)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteStaffConfirm(staffMember.staff_id)}
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

      {isPopupOpen && (
        <>
          <div className="popup-overlay" onClick={closeStaffPopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{staffData.staff_id ? 'Edit Staff' : 'Add Staff'}</h2>
              <button onClick={closeStaffPopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditStaff}>
              <div className="formGroup">
                <label htmlFor="user_name">Username</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={staffData.user_name}
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
                  value={staffData.email}
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
                  value={staffData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={staffData.role}
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
                <label htmlFor="teacher_id">Teacher ID</label>
                <input
                  type="number"
                  id="teacher_id"
                  name="teacher_id"
                  value={staffData.teacher_id}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="submitButton">
                {staffData.staff_id ? 'Update' : 'Add'}
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