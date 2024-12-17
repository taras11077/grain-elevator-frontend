import React from 'react';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, allowedRoles }) => {
	const { token, userData, loading } = useSelector((state) => state.auth);
  
	if (loading) {
	  return 'Loading...';
	}
  
	if (!token) {
	  return <Navigate to="/" />;
	}

	const userRole = userData?.role;

	if (allowedRoles && !allowedRoles.includes(userRole)) {
	  return <Navigate to="/forbidden" />;
	}
  
	return children;
  };
  
  export default PrivateRoute;
