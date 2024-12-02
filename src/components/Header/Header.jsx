import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from '../../slices/authThunk'
import './Header.css'

const Header = () => {
	const {token, userData} = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const logoutHandler = () => {
		dispatch(logout());
	}

	return (
		<div className='nav-container'>
			<NavLink className='nav-link' to="/">Home</NavLink>
			<NavLink className='nav-link' to="/input-invoices">InputInvoice</NavLink>
			<NavLink className='nav-link' to="/output-invoices">OutputInvoice</NavLink>
			<NavLink className='nav-link' to="/login">Login</NavLink>
			{!token ?  <NavLink className='nav-link' to="/login">Login</NavLink> : (
				<>
					Welcome, {userData.name}!
					<button onClick={logoutHandler}>Logout</button>
				 </>
			 )}
			 <NavLink className='nav-link' to="/register">Register</NavLink>
		</div>
	);
}

export default Header;
