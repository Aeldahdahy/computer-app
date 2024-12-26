import React, { useState } from 'react';
import ModuleHeader from './ModuleHeader';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department_id: '',
    department_name: '',
    department_head: '',
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or edit
  const openPopup = (department = null) => {
    if (department) {
      setFormData(department);
    } else {
      setFormData({
        department_id: '',
        department_name: '',
        department_head: '',
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
    if (formData.department_id) {
      setDepartments(
        departments.map((dept) =>
          dept.department_id === formData.department_id ? formData : dept
        )
      );
    } else {
      setDepartments([...departments, { ...formData, department_id: Date.now().toString() }]);
    }
    closePopup();
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (department_id) => {
    setSelectedDepartmentId(department_id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  // Handle delete
  const handleDeleteDepartment = () => {
    setDepartments(departments.filter((dept) => dept.department_id !== selectedDepartmentId));
    closeDeleteConfirm();
  };

  return (
    <div>
      <ModuleHeader ModuleName="Departments" />

      <div className="module">
        <button onClick={() => openPopup()} className="submitButton">
          Add New
        </button>

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
            {departments.map((department) => (
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
            <form onSubmit={handleFormSubmit}>
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
