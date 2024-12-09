import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from '../../asyncThunks/authThunk'
import './Header.css'

const Header = () => {
	const {token, userData} = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(logout());
	}

	return (
		<div className='nav-container'>
			{/* <NavLink className='nav-link' to="/home">Home</NavLink> */}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Laboratory') && (
        		<NavLink className="nav-link" to="/input-invoices">InputInvoice</NavLink>
      		)}

			{token && (
        		<NavLink className="nav-link" to="/output-invoices">OutputInvoice</NavLink>
      		)}

			{!token ?  <NavLink className='nav-link' to="/login">Login</NavLink> : (
				<>
					Користувач: {userData.name}
					<button onClick={logoutHandler}>Logout</button>
				 </>
			 )}
			<NavLink id='login-registration-link' className='nav-link' to="/registration">Registration</NavLink>
		</div>
	);
}

export default Header;
