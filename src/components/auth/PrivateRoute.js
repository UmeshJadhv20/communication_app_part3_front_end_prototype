// components/auth/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
    const isLoggedIn = !!localStorage.getItem('loggedUser'); // Check if user is logged in

    // return isLoggedIn ? <Element /> : <Navigate to="/" />;
};

export default PrivateRoute;
