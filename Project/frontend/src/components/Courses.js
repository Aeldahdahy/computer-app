import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import axios from 'axios';
import { useFunctions } from '../useFunctions';
import SearchBox from './SearchBox';

function Courses() {
  const { API_BASE, setError } = useFunctions();
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    credits: '',
    department_id: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [originalFormData, setOriginalFormData] = useState({});

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/course`);
      setCourses(response.data.course || []);
    } catch (error) {
      setError(error.message || "Failed to fetch courses");
      console.error("Error fetching courses:", error.response || error.message);
    }
  }, [API_BASE, setError]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createEditCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized: Please log in.');
      return;
    }

    if (!formData.course_id && !validateCourseInput()) return;

    const payload = { course_id: formData.course_id }; // Ensure course_id is included
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
      if (formData.course_id) {
        // Update existing course
        await axios.put(`${API_BASE}/course`, payload, config);
      } else {
        // Add new course
        await axios.post(`${API_BASE}/course`, payload, config);
      }
      fetchCourses(); // Refresh the course list
      closePopup();
    } catch (error) {
      console.error('Error saving course:', error.response?.data || error.message);
    }
  };

  const handleDeleteCourse = async () => {
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
        course_id: selectedCourseId,
      },
    };

    try {
      await axios.delete(`${API_BASE}/course`, config);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateCourseInput = () => {
    const { course_name, credits, department_id } = formData;

    if (!course_name || !credits || !department_id) {
      alert('Please fill in all required fields.');
      return false;
    }

    return true;
  };

  const openPopup = (course = null) => {
    if (course) {
      setFormData(course);
      setOriginalFormData(course);
    } else {
      const newFormData = {
        course_id: '',
        course_name: '',
        credits: '',
        department_id: '',
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData);
    }
    setPopupOpen(true);
  };

  const openDeleteConfirm = (course_id) => {
    setSelectedCourseId(course_id);
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

  const displayedCourses = searchResults.length > 0 ? searchResults : courses;

  return (
    <div>
      <ModuleHeader ModuleName="Courses" />

      <div className="module">
        <div className='module-header'>
          <button onClick={() => openPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Courses" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCourses.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.course_name}</td>
                <td>{course.credits}</td>
                <td>{course.department_name || 'N/A'}</td>
                <td>
                  <button onClick={() => openPopup(course)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(course.course_id)}
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
              <h2>{formData.course_id ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={closePopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditCourse}>
              <div className="formGroup">
                <label htmlFor="course_name">Course Name</label>
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="credits">Credits</label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
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
                  required
                />
              </div>
              <button type="submit" className="submitButton">
                {formData.course_id ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete this course?</p>
            <button onClick={handleDeleteCourse} className="deleteButton">
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

export default Courses;