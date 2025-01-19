import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createSupplier,
	deleteSupplier,
	fetchSuppliers,
	updateSupplier
} from '../asyncThunks/supplierThunk'
import SupplierFilterFields from '../components/Supplier/SupplierFilterFields'
import SupplierForm from '../components/Supplier/SupplierForm'
import SupplierTable from '../components/Supplier/SupplierTable'
import { setFilters, setPagination, setSelectedSupplier, setSort, toggleModal } from '../slices/supplierSlice'
import './InputInvoicePage.css'

const SupplierPage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();

	 // Стан із Redux
	 const { 
		suppliers, 
		loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedSupplier, 
	  } = useSelector((state) => state.suppliers);
  
	// Завантаження Постачальника
	useEffect(() => {
		dispatch(fetchSuppliers());
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
		dispatch(fetchSuppliers());
	  };
	
	  // Відкрити модальне вікно для створення/редагування Постачальника
	  const handleOpenModal = (operation = null) => {
		dispatch(setSelectedSupplier(operation));
		dispatch(toggleModal(true));
	  };
	
	  // Закрити модальне вікно
	  const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setSelectedSupplier(null));
	  };
	
	  // Додавання чи оновлення Постачальника
	  const handleFormSubmit = async (formData) => {
		try {
		  if (selectedSupplier) {
				const resultAction = await dispatch(updateSupplier({ id: selectedSupplier.id, updates: formData })).unwrap();
			  	message.success(`Постачальника з ID ${resultAction.id} успішно оновлено.`);
		  } else {
				const resultAction = await dispatch(createSupplier(formData)).unwrap();
				message.success(`Постачальника з ID ${resultAction.id} успішно створено.`);
		  }
		  dispatch(fetchSuppliers());
		  handleCloseModal();
		} catch (error) {
			handleError(error);
		}
	  };
	
	  // Видалення Постачальника
	  const handleDeleteSupplier = async (record) => {
		let deletedSupplier = null;
		try {
		  deletedSupplier = await dispatch(deleteSupplier(record.id)).unwrap();
		  message.success(`Постачальника ${deletedSupplier.title} успішно видалено!`);
		  dispatch(fetchSuppliers());
		} catch (error) {
			handleError(error);
		};
	  }

	  // Обробка помилок
		const handleError = (error) => {
			if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
			} else if(error.status === 404) {
				message.error(error.message || `Таку Постачальника не знайдено.`);
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
		   <Title level={1} className="page-title">
			  	Перелік Постачальників
			</Title>

			<Title level={4} className="page-subtitle">
				які поставили продукцію на підприємство за останній звітний період.
			</Title>
	
			<SupplierFilterFields filters={filters} onFilterChange={handleFilterChange} />
		
			<Button 
			className="action-button"
			onClick={() => handleOpenModal(null)} 
			>
				Створити Постачальника
			</Button>
		
			<SupplierTable
				suppliers={suppliers}
				loading={loading}
				pagination={pagination}
				onTableChange={handleTableChange}
				handleOpenModal={handleOpenModal}
				handleDeleteSupplier={handleDeleteSupplier}
			/>

			<Modal
				title={selectedSupplier ? 'Редагувати Постачальника' : 'Створити Постачальника'}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={null}
			>
				<SupplierForm
				key={selectedSupplier ? selectedSupplier.id : 'new'}
				initialData={selectedSupplier || {}}
				onSubmit={handleFormSubmit}
				onCancel={handleCloseModal}
				isEditing={!!selectedSupplier}
				/>
			</Modal>
		</div>
	  );
	};
	
	export default SupplierPage;