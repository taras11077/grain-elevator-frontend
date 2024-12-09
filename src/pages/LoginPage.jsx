// import React from 'react';
// import LoginForm from '../components/Auth/LoginForm';

// const LoginPage = () => {
// 	return (
// 	  <div>
// 		<h2>Вхід до системи</h2>
// 			<LoginForm onLoginSuccess={() => window.location.href = '/input-invoices'} />
// 	  </div>
// 	);
//   };
  

// export default LoginPage;

import { Modal } from 'antd'
import React, { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import { getToken } from '../utils/tokenHelperFunctions'


const Login = () => {
	const {token} = useSelector(state => state.auth);
	const navigate = useNavigate();

	const [isModalOpen, setIsModalOpen] = useState(true);

	useEffect(() => {
		setIsModalOpen(true);
	}, []);

	if(token || getToken()) {
		return <Navigate to="/" />
	}

	  const closeModal = () => {
		setIsModalOpen(false);
	  };

	  const handleCancel = () => {
		setIsModalOpen(false);
		navigate('/');
	  };


	return (
		<Modal 
			title="Login"
			open={isModalOpen}
			onCancel={handleCancel}
			footer={null}>

			<LoginForm closeModal={closeModal}/>
  		</Modal>
	);
}

export default Login;

