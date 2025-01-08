import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import axios from 'axios';
import { useFunctions } from '../useFunctions';
import SearchBox from './SearchBox';

function Departments() {
  const { API_BASE, setError } = useFunctions();
  const [departments, setDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    department_id: '',
    department_name: '',
    department_head: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [originalFormData, setOriginalFormData] = useState({});

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/department`);
      setDepartments(response.data.department || []);
    } catch (error) {
      setError(error.message || "Failed to fetch departments");
      console.error("Error fetching departments:", error.response || error.message);
    }
  }, [API_BASE, setError]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const createEditDepartment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!formData.department_id && !validateDepartmentInput()) return;

    const payload = { department_id: formData.department_id }; // Ensure department_id is included
    for (const key in formData) {
      if (formData[key] !== originalFormData[key]) {
        payload[key] = formData[key];
      }
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      if (formData.department_id) {
        // Update existing department
        await axios.put(`${API_BASE}/department`, payload, config);
      } else {
        // Add new department
        await axios.post(`${API_BASE}/department`, payload, config);
      }
      fetchDepartments(); // Refresh the department list
      closePopup();
    } catch (error) {
      console.error('Error saving department:', error.response?.data || error.message);
    }
  };

  const handleDeleteDepartment = async () => {
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
        department_id: selectedDepartmentId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/department`, config);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateDepartmentInput = () => {
    const { department_name, department_head } = formData;

    if (!department_name || !department_head) {
      alert('Please fill in all required fields.');
      return false;
    }

    return true;
  };

  const openPopup = (department = null) => {
    if (department) {
      setFormData(department);
      setOriginalFormData(department);
    } else {
      const newFormData = {
        department_id: '',
        department_name: '',
        department_head: '',
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData);
    }
    setPopupOpen(true);
  };

  const openDeleteConfirm = (department_id) => {
    setSelectedDepartmentId(department_id);
    setDeleteConfirmOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayedDepartments = searchResults.length > 0 ? searchResults : departments;

  return (
    <div>
      <ModuleHeader ModuleName="Departments" />

      <div className="module">
        <div className='module-header'>
          <button onClick={() => openPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Departments" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Department Head</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedDepartments.map((department) => (
              <tr key={department.department_id}>
                <td>{department.department_id}</td>
                <td>{department.department_name}</td>
                <td>{department.department_head}</td>
                <td>
                  <button onClick={() => openPopup(department)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(department.department_id)}
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
              <h2>{formData.department_id ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={closePopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditDepartment}>
              <div className="formGroup">
                <label htmlFor="department_name">Department Name</label>
                <input
                  type="text"
                  id="department_name"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="department_head">Department Head</label>
                <input
                  type="text"
                  id="department_head"
                  name="department_head"
                  value={formData.department_head}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submitButton">
                {formData.department_id ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete this department?</p>
            <button onClick={handleDeleteDepartment} className="deleteButton">
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

export default Departments;