import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ModuleHeader from './ModuleHeader';
import { useFunctions } from '../useFunctions';
import SearchBox from './SearchBox';

function Classes() {
  const { API_BASE, setError } = useFunctions();
  const [classes, setClasses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    class_id: '',
    scheduled_time: '',
    room_number: '',
    course_id: '',
    teacher_id: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [originalFormData, setOriginalFormData] = useState({});

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/class`);
      console.log('Fetched classes:', response.data);
      setClasses(response.data.class || []);
    } catch (error) {
      setError(error.message || "Failed to fetch classes");
      console.error("Error fetching classes:", error.response || error.message);
    }
  }, [API_BASE, setError]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createEditClass = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!formData.class_id && !validateClassInput()) return;

    const payload = { class_id: formData.class_id }; // Ensure class_id is included
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
      if (formData.class_id) {
        // Update existing class
        await axios.put(`${API_BASE}/class`, payload, config);
      } else {
        // Add new class
        await axios.post(`${API_BASE}/class`, payload, config);
      }
      fetchClasses(); // Refresh the class list
      closePopup();
    } catch (error) {
      console.error('Error saving class:', error.response?.data || error.message);
    }
  };

  const handleDeleteClass = async () => {
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
        class_id: selectedClassId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/class`, config);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateClassInput = () => {
    const { scheduled_time, room_number, course_id, teacher_id } = formData;

    if (!scheduled_time || !room_number || !course_id || !teacher_id) {
      alert('Please fill in all required fields.');
      return false;
    }

    return true;
  };

  const openPopup = (classItem = null) => {
    if (classItem) {
      setFormData(classItem);
      setOriginalFormData(classItem);
    } else {
      const newFormData = {
        class_id: '',
        scheduled_time: '',
        room_number: '',
        course_id: '',
        teacher_id: '',
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData);
    }
    setPopupOpen(true);
  };

  const openDeleteConfirm = (class_id) => {
    setSelectedClassId(class_id);
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

  const displayedClasses = searchResults.length > 0 ? searchResults : classes;

  return (
    <div>
      <ModuleHeader ModuleName="Classes" />

      <div className="module">
        <div className='module-header'>
          <button onClick={() => openPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Classes" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Class ID</th>
              <th>Scheduled Time</th>
              <th>Room Number</th>
              <th>Course Name</th>
              <th>Teacher Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedClasses.map((classItem) => (
              <tr key={classItem.class_id}>
                <td>{classItem.class_id}</td>
                <td>{classItem.scheduled_time}</td>
                <td>{classItem.room_number}</td>
                <td>{classItem.course_name || 'N/A'}</td>
                <td>{classItem.full_name || 'N/A'}</td>
                <td>
                  <button onClick={() => openPopup(classItem)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(classItem.class_id)}
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
              <h2>{formData.class_id ? 'Edit Class' : 'Add Class'}</h2>
              <button onClick={closePopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditClass}>
              <div className="formGroup">
                <label htmlFor="scheduled_time">Scheduled Time</label>
                <input
                  type="text"
                  id="scheduled_time"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="room_number">Room Number</label>
                <input
                  type="text"
                  id="room_number"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="course_id">Course ID</label>
                <input
                  type="number"
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
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
                  required
                />
              </div>
              <button type="submit" className="submitButton">
                {formData.class_id ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete this class?</p>
            <button onClick={handleDeleteClass} className="deleteButton">
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

export default Classes;