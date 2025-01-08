import React from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './SideBar';

function Dashboard() {
  const token = localStorage.getItem('authToken');

  let tokenDecode;
  try {
    tokenDecode = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error('Invalid token:', error);
    tokenDecode = null;
  }

  if (!tokenDecode) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-layout">
      <SideBar userRole={tokenDecode.role} />
      <div className="dashboard-content">
        <div className="scrollable-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;