import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModuleHeader from './ModuleHeader';

function Classes() {
  const [classes, setClasses] = useState([]);
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

  const apiBaseUrl = 'http://localhost:27879/public/class';

  // Fetch classes from the API
  const fetchClasses = async () => {
    try {
      const response = await axios.get(apiBaseUrl, { params: { class_id: '%' } });
      setClasses(response.data.class);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or edit
  const openPopup = (classItem = null) => {
    if (classItem) {
      setFormData(classItem);
    } else {
      setFormData({
        class_id: '',
        scheduled_time: '',
        room_number: '',
        course_id: '',
        teacher_id: '',
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
      if (formData.class_id) {
        // Update existing class
        await axios.put(apiBaseUrl, {
          class_id: formData.class_id,
          scheduled_time: formData.scheduled_time,
          room_number: formData.room_number,
          course_id: formData.course_id,
          tearcher_id: formData.teacher_id,
        });
      } else {
        // Add new class
        await axios.post(apiBaseUrl, {
          scheduled_time: formData.scheduled_time,
          room_number: formData.room_number,
          course_id: formData.course_id,
          tearcher_id: formData.teacher_id,
        });
      }
      fetchClasses();
      closePopup();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (class_id) => {
    setSelectedClassId(class_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle delete
  const handleDeleteClass = async () => {
    try {
      await axios.delete(apiBaseUrl, { params: { class_id: selectedClassId } });
      fetchClasses();
      closeDeleteConfirm();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div>
      <ModuleHeader ModuleName="Classes" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">
          Add New
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Class ID</th>
              <th>Scheduled Time</th>
              <th>Room Number</th>
              <th>Course ID</th>
              <th>Teacher ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.class_id}>
                <td>{classItem.class_id}</td>
                <td>{classItem.scheduled_time}</td>
                <td>{classItem.room_number}</td>
                <td>{classItem.course_id || 'N/A'}</td>
                <td>{classItem.teacher_id || 'N/A'}</td>
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
            <form onSubmit={handleFormSubmit}>
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
