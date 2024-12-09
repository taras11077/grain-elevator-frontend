import React from 'react';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
	const{token, loading} = useSelector(state => state.auth);

	if(loading) {
		return 'Loading...';
	}

	return (
		token ? children : <Navigate to="/" />
	);
}


export default PrivateRoute;
