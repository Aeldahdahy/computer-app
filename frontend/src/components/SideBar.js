import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  DoorOpen,
  House,
  ClipboardCheck,
  UsersRound,
  UserRoundCog,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  School,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFunctions } from '../useFunctions';

function SideBar({ userRole }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logOut } = useFunctions();
  

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  let sideBarModules;
  switch (userRole) {
    case 'Admin':
      sideBarModules = (
        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <House />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link to="/dashboard/staff" className="sidebar-link">
            <UserRoundCog />
            {isExpanded && <span>Staff</span>}
          </Link>

          <Link to="/dashboard/teacher" className="sidebar-link">
            <UserRoundCog />
            {isExpanded && <span>Teachers</span>}
          </Link>

          <Link to="/dashboard/students" className="sidebar-link">
            <UsersRound />
            {isExpanded && <span>Students</span>}
          </Link>
          
          <Link to="/dashboard/departments" className="sidebar-link">
            <BookOpen />
            {isExpanded && <span>Departments</span>}
          </Link>

          <Link to="/dashboard/courses" className="sidebar-link">
            <School />
            {isExpanded && <span>Courses</span>}
          </Link>
          
          <Link to="/dashboard/class" className="sidebar-link">
            <DoorOpen />
            {isExpanded && <span>Classes</span>}
          </Link>

          <Link to="/dashboard/attendance" className="sidebar-link">
            <ClipboardCheck />
            {isExpanded && <span>Attendance</span>}
          </Link>

          <Link onClick={logOut} className="sidebar-link logout-link">
            <LogOut />
            {isExpanded && <span>Logout</span>}
          </Link>
        </div>
      );
      break;

    case 'Moderator':
      sideBarModules = (
        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <House />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link to="/dashboard/courses" className="sidebar-link">
            <School />
            {isExpanded && <span>Courses</span>}
          </Link>

          <Link to="/dashboard/attendance" className="sidebar-link">
            <ClipboardCheck />
            {isExpanded && <span>Attendance</span>}
          </Link>

          <Link onClick={logOut} className="sidebar-link logout-link">
            <LogOut />
            {isExpanded && <span>Logout</span>}
          </Link>
        </div>
      );
      break;

    default: 
      sideBarModules = (
        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <House />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link to="/dashboard/courses" className="sidebar-link">
            <School />
            {isExpanded && <span>Courses</span>}
          </Link>

          <Link to="/dashboard/attendance" className="sidebar-link">
            <ClipboardCheck />
            {isExpanded && <span>Attendance</span>}
          </Link>

          <Link onClick={logOut} className="sidebar-link logout-link">
            <LogOut />
            {isExpanded && <span>Logout</span>}
          </Link>
        </div>
      );
      break;
  }




  return (
    <motion.div
      className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
      initial={{ width: isExpanded ? '250px' : '80px' }}
      animate={{ width: isExpanded ? '250px' : '80px' }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <LayoutDashboard />
          {isExpanded && <span>{userRole} Panel</span>}
        </Link>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isExpanded ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>

      {sideBarModules}
    </motion.div>
  );
}

export default SideBar;
