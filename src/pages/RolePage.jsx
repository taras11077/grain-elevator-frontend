import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	createRole,
	deleteRole,
	fetchRoles,
	updateRole
} from '../asyncThunks/roleThunk'
import RoleFilterFields from '../components/Role/RoleFilterFields'
import RoleForm from '../components/Role/RoleForm'
import RoleTable from '../components/Role/RoleTable'
import { setFilters, setPagination, setSelectedRole, setSort, toggleModal } from '../slices/roleSlice'
import './InputInvoicePage.css'

const RolePage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();

	 // Стан із Redux
	 const { 
		roles, 
		loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedRole, 
	  } = useSelector((state) => state.roles);
  
	// Завантаження Ролі
	useEffect(() => {
		dispatch(fetchRoles());
	  }, [dispatch, filters, pagination.current, pagination.pageSize]);
  
	// Обробка фільтрів
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		dispatch(setFilters({ [name]: value }));
	};

	// Обробка змін у таблиці (пагінація, сортування)
	const handleTableChange = (pagination, _, sorter) => {
		const sortField = sorter?.field || null;
		const sortOrder = sorter?.order === 'ascend' ? 'asc' : 'desc';
		dispatch(setSort({ sortField, sortOrder }));
		dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
		dispatch(fetchRoles());
	  };
	
	  // Відкрити модальне вікно для створення/редагування Ролі
	  const handleOpenModal = (operation = null) => {
		dispatch(setSelectedRole(operation));
		dispatch(toggleModal(true));
	  };
	
	  // Закрити модальне вікно
	  const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setSelectedRole(null));
	  };
	
	  // Додавання чи оновлення Ролі
	  const handleFormSubmit = async (formData) => {
		try {
		  if (selectedRole) {
				const resultAction = await dispatch(updateRole({ id: selectedRole.id, updates: formData })).unwrap();
			  	message.success(`Роль з ID ${resultAction.id} успішно оновлено.`);
		  } else {
				const resultAction = await dispatch(createRole(formData)).unwrap();
				message.success(`Роль з ID ${resultAction.id} успішно створено.`);
		  }
		  dispatch(fetchRoles());
		  handleCloseModal();
		} catch (error) {
			handleError(error);
		}
	  };
	
	  // Видалення Ролі
	  const handleDeleteRole = async (record) => {
		let deletedRole = null;
		try {
		  deletedRole = await dispatch(deleteRole(record.id)).unwrap();
		  message.success(`Роль ${deletedRole.title} успішно видалено!`);
		  dispatch(fetchRoles());
		} catch (error) {
			handleError(error);
		};
	  }

	  // Обробка помилок
		const handleError = (error) => {
			if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
			} else if(error.status === 404) {
				message.error(error.message || `Таку Роль не знайдено.`);
			} else if (error.status === 400) {
				message.error(error.message || 'Помилка: невірні дані форми.');
			} else if (error.status === 500) {
				message.error(error.message || 'Внутрішня помилка сервера. Спробуйте пізніше.');
			} else {
				message.error(error.message || 'Сталася помилка.');
			}
			console.error('Помилка:', error);
		};

	  return (
		<div className="container">
		  	<Title level={1} style={{ textAlign: 'center', color: 'steelblue', margin: 20 }}>
			  	Ролі співробітників
			</Title>

			<Title level={4} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
				що визначають доступ до інформації.
			</Title>
	
			<RoleFilterFields filters={filters} onFilterChange={handleFilterChange} />
		
			<Button 
			type="primary" 
			onClick={() => handleOpenModal(null)} 
			style={{
				margin: 30,
				width: '20%',
				maxWidth: '250px',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			}}
			>
				Створити Роль
			</Button>
		
			<RoleTable
				roles={roles}
				loading={loading}
				pagination={pagination}
				onTableChange={handleTableChange}
				handleOpenModal={handleOpenModal}
				handleDeleteRole={handleDeleteRole}
			/>

			<Modal
				title={selectedRole ? 'Редагувати Роль' : 'Створити Роль'}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={null}
			>
				<RoleForm
				key={selectedRole ? selectedRole.id : 'new'}
				initialData={selectedRole || {}}
				onSubmit={handleFormSubmit}
				onCancel={handleCloseModal}
				isEditing={!!selectedRole}
				/>
			</Modal>
		</div>
	  );
	};
	
	export default RolePage;
	