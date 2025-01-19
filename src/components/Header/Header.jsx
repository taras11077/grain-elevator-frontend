import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { logout, updateLastSeenOnline } from '../../asyncThunks/authThunk'
import './Header.css'

const Header = () => {
	const {token, userData} = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const location = useLocation(); 
	const isHomePage = location.pathname === '/home'; 

	const logoutHandler = async () => {
		try {
			await dispatch(logout({ id: userData.id })).unwrap();
		} catch (error) {
			console.error('Помилка при виході з системи:', error);
		}
	};

	return (
		<div className={`nav-container ${isHomePage ? 'home-page' : ''}`}>
			{/* <NavLink 
			className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
			to="/home">На головну</NavLink> */}

			{(userData.role === 'Admin' ||
					 userData.role === 'CEO' || 
					 userData.role === 'Laboratory') && (
        		<NavLink
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				 to="/input-invoices">Прибуткові накладні</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Laboratory' || 
					 userData.role === 'Technologist') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/laboratory-cards">Лабораторні картки</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Technologist') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/register">Реєстри</NavLink>
      		)}

			{(userData.role === 'Admin' || 
					userData.role === 'CEO' || 
					userData.role === 'Technologist') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/technological-operation">Технологичні операції</NavLink>
      		)}

			{(userData.role === 'Admin' || 
					userData.role === 'CEO' || 
					userData.role === 'Technologist' || 
					userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/completion-report">Акти</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/price-list">Прайси</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/warehouse">Склад</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO' || userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`} 
				to="/output-invoices">Видаткові накладні</NavLink>
      		)}

			{(userData.role === 'Admin' ||	userData.role === 'CEO'|| 	userData.role === 'Technologist' ||	userData.role === 'Laboratory' || userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/suppliers">Постачальники</NavLink>
      		)}

			{(userData.role === 'Admin' || 	userData.role === 'CEO'|| userData.role === 'Technologist' || userData.role === 'Laboratory' ||	userData.role === 'Accountant') && (
        		<NavLink 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				to="/products">Продукція</NavLink>
      		)}


			{(userData.role === 'Admin' || userData.role === 'HR'|| userData.role === 'CEO') && (
        		<NavLink id='nav-link'
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				  to="/employee">Співробітники</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'HR'|| userData.role === 'CEO') && (
        		<NavLink id='nav-link' 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				 to="/role">Ролі</NavLink>
      		)}

			{(userData.role === 'Admin' || userData.role === 'CEO') && (
        		<NavLink id='nav-link' 
				className={`nav-link ${isHomePage ? 'home-page-link' : ''}`}
				 to="/statistic">Статистика</NavLink>
      		)}

			{(token) && (
				<div className="center-container">
					<div
					className={`user-name ${isHomePage ? 'home-page-user-name' : ''}`}
					>
						{userData.name}
					</div>
					
					<button onClick={logoutHandler}>Вихід</button>
				</div>			
			 )}
		</div>
	);
}

export default Header;
