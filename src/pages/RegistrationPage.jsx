// import React from 'react';
// import RegisterForm from '../components/Auth/RegisterForm';

// const RegisterPage = () => {
//   return (
//     <div>
//       <h1>Реєстрація</h1>
//       <RegisterForm />
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from 'react';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';
import RegistrationForm from '../components/Auth/RegistrationForm';

const Registration = () => {
	const [isModalOpen, setIsModalOpen] = useState(true);

	  const closeModal = () => {
		setIsModalOpen(false);
	  };
	  
	  const handleCancel = () => {
		setIsModalOpen(false);
		return <Navigate to="/" />;
	  };

	return (
		<Modal 
			title="Registration"
			open={isModalOpen}
			onCancel={handleCancel}
			footer={null}>

			<RegistrationForm closeModal={closeModal}/>
  		</Modal>
	);
}

export default Registration;
