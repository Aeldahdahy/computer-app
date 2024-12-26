import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Corrected import (no curly braces)
import isUserImage from '../assets/Bob.jpg';
import SearchBox from './SearchBox';

function ModuleHeader({ ModuleName }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decode = jwtDecode(token);
        console.log(decode);
        setUserName(decode.name || decode.userName || 'User');
      } catch (error) {
        console.error('Invalid Token', error);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="moduleContainer">
      {/* Module Name on the left */}
      <div className="moduleHeader">
        <span>{ModuleName} Dashboard</span>
      </div>
        <SearchBox />
      {/* User Info and Dropdown on the right */}
      <div className="moduleUser">
        <div className="moduleUserIcon" onClick={toggleDropdown}>
          {isUserImage ? (
            <img src={isUserImage} alt="User" className="userImage" />
          ) : (
            <User />
          )}
        </div>
        <span className="moduleUserName">{userName}</span>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="dropdownMenu">
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleHeader;
