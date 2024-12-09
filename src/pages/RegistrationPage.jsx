import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom'
import RegistrationForm from '../components/Auth/RegistrationForm';

const Registration = () => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(true);

	useEffect(() => {
		setIsModalOpen(true);
	}, []);

	  const closeModal = () => {
		setIsModalOpen(false);
	  };

	  const handleCancel = () => {
		setIsModalOpen(false);
		navigate('/');
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
