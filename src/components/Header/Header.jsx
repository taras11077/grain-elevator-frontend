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
        		<NavLink className="nav-link" to="/input-invoices">Прибуткові накладні</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Laboratory') && (
        		<NavLink className="nav-link" to="/laboratory-cards">Лабораторні карточки</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Accountant') && (
        		<NavLink className="nav-link" to="/output-invoices">Видаткові накладні</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'HR') && (
        		<NavLink id='login-registration-link' className='nav-link' to="/registration">Співробітники</NavLink>
      		)}

			{(token) && (
				<div>
					Користувач: {userData.name}
					<button onClick={logoutHandler}>Вихід</button>
				</div>			
			 )}
		</div>
	);
}

export default Header;
