import React from 'react';
import { Route, Navigate } from 'react-router-dom';


function PrivateRoute({ element, ...rest }) {
    const isAuthenticated = localStorage.getItem('authToken');
    if(!isAuthenticated){
        return <Navigate to='/' replace />;
    }

    return <Route {...rest} element={element} />;
}

export default PrivateRoute;