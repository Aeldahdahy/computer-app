import React, { useState } from 'react';
import { useFunctions } from '../useFunctions';
import { Search } from 'lucide-react';
import axios from 'axios';

function SearchBox({ ModuleName, onSearchResults }) {
  const { API_BASE, setError } = useFunctions();
  
  const [searchTerm, setSearchTerm] = useState('');

  const moduleMapping = {
    'Departments': { table: 'department', columns: ['department_name', 'department_head'] },
    'Courses': { table: 'course', columns: ['course_name', 'credits', 'department_id'] },
    'Classes': { table: 'class', columns: ['scheduled_time', 'room_number', 'course_id', 'teacher_id'] },
    'Students': { table: 'student', columns: ['fname', 'lname', 'email', 'phone_number', 'status'] },
    'Teachers': { table: 'teacher', columns: ['fname', 'lname', 'email', 'phone_number', 'status'] },
    'Attendance': { table: 'attendance', columns: ['date', 'status', 'remarks', 'class_id'] },
    'Staff': { table: 'staff', columns: ['user_name', 'role', 'email', 'teacher_id'] },
    // Add more mappings as needed
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    const { table, columns } = moduleMapping[ModuleName] || {};

    if (!table || !columns) {
      setError('Invalid module name');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/search`, {
        params: {
          table,
          columns: columns.join(','), // Join columns with a comma
          value: searchTerm,
        },
      });
      console.log('Search results:', response.data);
      onSearchResults(response.data.data || []);
    } catch (error) {
      setError(error.message || "Failed to fetch search results");
      console.error("Error fetching search results:", error.response || error.message);
    }
  };

  return (
      <form className="searchBox" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="searchContainer">
          <button type="button" className="iconButton" onClick={handleSearch}>
            <Search />
          </button>
          <span className="separator">|</span>
          <input
            className="searchInput"
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
      </form>
  );
}

export default SearchBox;