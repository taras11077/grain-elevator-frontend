import React from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Home.css';

const AuthRequest = () => (
	<div>
	  <Typography.Title className="home-title">
		Ласкаво просимо до Grain Elevator System
	  </Typography.Title>
	  <Typography.Text className="home-text">
		Для початку роботи авторізуйтесь в системі.
	  </Typography.Text>
	  <NavLink className="nav-link" to="/login">
	  	<button className="nav-button">Вхід</button>
	  </NavLink>
	</div>
  );
  
  const UserGreeting = ({ name }) => (
	<div>
	  <Typography.Title className="home-greeting">
		Вітаю, {name}!
	  </Typography.Title>
	  <Typography.Title className="home-greeting">
		Дякую за наполегливу роботу. Нехай буде ще один успішний день!
	  </Typography.Title>
	</div>
  );
  
  const Home = () => {
	const { token, userData } = useSelector((state) => state.auth);
	return (
	  <div className="home-container">
		{!token ? <AuthRequest /> : <UserGreeting name={userData?.name} />}
	  </div>
	);
  };
  
  export default Home;
  
