import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
	return (
	  <div>
		<h2>Вхід до системи</h2>
			<LoginForm onLoginSuccess={() => window.location.href = '/input-invoices'} />
	  </div>
	);
  };
  

export default LoginPage;

