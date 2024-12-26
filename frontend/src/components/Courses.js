import React, { useState } from 'react';
import ModuleHeader from './ModuleHeader';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    credits: '',
    department_id: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or edit
  const openPopup = (course = null) => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        course_id: '',
        course_name: '',
        credits: '',
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
    if (formData.course_id) {
      setCourses(
        courses.map((course) =>
          course.course_id === formData.course_id ? formData : course
        )
      );
    } else {
      setCourses([...courses, { ...formData, course_id: Date.now().toString() }]);
    }
    closePopup();
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (course_id) => {
    setSelectedCourseId(course_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle delete
  const handleDeleteCourse = () => {
    setCourses(courses.filter((course) => course.course_id !== selectedCourseId));
    closeDeleteConfirm();
  };

  return (
    <div>
      <ModuleHeader ModuleName="Courses" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">
          Add New
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Department ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.course_name}</td>
                <td>{course.credits}</td>
                <td>{course.department_id || 'N/A'}</td>
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
            <form onSubmit={handleFormSubmit}>
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
