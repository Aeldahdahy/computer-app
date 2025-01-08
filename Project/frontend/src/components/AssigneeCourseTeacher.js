import React, { useState, useEffect, useCallback } from 'react';
import ModuleHeader from './ModuleHeader';
import SearchBox from './SearchBox';
import axios from 'axios';
import { useFunctions } from '../useFunctions';

function AssigneeCourseTeacher() {
  const { API_BASE } = useFunctions();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [associations, setAssociations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [associationData, setAssociationData] = useState({
    teacher_id: '',
    course_id: '',
  });

  const fetchAssociations = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/teacher_course`);
      setAssociations(response.data.teacher_course);
    } catch (error) {
      console.error('Error fetching associations:', error.message || error.response);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAssociations();
  }, [fetchAssociations]);

  const createEditAssociation = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    const payload = {
      teacher_id: associationData.teacher_id,
      course_id: associationData.course_id,
    };

    try {
      if (selectedAssociation) {
        await axios.put(`${API_BASE}/teacher_course`, payload);
      } else {
        await axios.post(`${API_BASE}/teacher_course`, payload);
      }
      fetchAssociations();
      closePopup();
    } catch (error) {
      console.error('Error saving association:', error.response?.data || error.message);
    }
  };

  const handleDeleteAssociation = async () => {
    try {
      await axios.delete(`${API_BASE}/teacher_course`, {
        data: {
          teacher_id: selectedAssociation.teacher_id,
          course_id: selectedAssociation.course_id,
        },
      });
      fetchAssociations();
    } catch (error) {
      console.error('Error deleting association:', error.response?.data || error.message);
    } finally {
      closeDeleteConfirm();
    }
  };

  const validateInput = () => {
    const { teacher_id, course_id } = associationData;

    if (!teacher_id || !course_id) {
      alert('Please fill in all required fields.');
      return false;
    }

    return true;
  };

  const openPopup = (association = null) => {
    if (association) {
      setAssociationData({
        teacher_id: association.teacher_id,
        course_id: association.course_id,
      });
      setSelectedAssociation(association);
    } else {
      setAssociationData({
        teacher_id: '',
        course_id: '',
      });
      setSelectedAssociation(null);
    }
    setPopupOpen(true);
  };

  const openDeleteConfirm = (association) => {
    setSelectedAssociation(association);
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
    setAssociationData({ ...associationData, [name]: value });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayedAssociations = searchResults.length > 0 ? searchResults : associations;

  return (
    <div>
      <ModuleHeader ModuleName="Assignee Course Teacher" />
      <div className="module">
        <div className='module-header'>
          <button onClick={() => openPopup()} className="submitButton">
            Add New
          </button>
          <SearchBox ModuleName="Assignee Course Teacher" onSearchResults={handleSearchResults} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Department</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssociations.map((association) => (
              <tr key={`${association.teacher_id}-${association.course_id}`}>
                <td>{association.full_name}</td>
                <td>{association.department_name}</td>
                <td>{association.course_name}</td>
                <td>
                  <button onClick={() => openPopup(association)} className="submitButton">
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(association)}
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
          <div className="popup-overlay" onClick={closePopup}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>{selectedAssociation ? 'Edit Association' : 'Add Association'}</h2>
              <button onClick={closePopup} className="closeButton">
                &times;
              </button>
            </div>
            <form onSubmit={createEditAssociation}>
              <div className="formGroup">
                <label htmlFor="teacher_id">Teacher ID</label>
                <input
                  type="number"
                  id="teacher_id"
                  name="teacher_id"
                  value={associationData.teacher_id}
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
                  value={associationData.course_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submitButton">
                {selectedAssociation ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete this association?</p>
            <button onClick={handleDeleteAssociation} className="deleteButton">
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

export default AssigneeCourseTeacher;