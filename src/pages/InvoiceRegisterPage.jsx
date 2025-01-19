import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createRegister,
	deleteRegister,
	fetchRegisters,
	updateRegister,
} from '../asyncThunks/invoiceRegisterThunk'
import InvoiceRegisterFilterFields from '../components/InvoiceRegister/InvoiceRegisterFilterFields'
import InvoiceRegisterForm from '../components/InvoiceRegister/InvoiceRegisterForm'
import InvoiceRegisterTable from '../components/InvoiceRegister/InvoiceRegisterTable'
import { 
	setFilters, 
	setPagination, 
	setSelectedRegister, 
	setSort, 
	toggleModal } from '../slices/invoiceRegisterSlice'
import { setSelectedRegisterIds } from "../slices/completionReportSlice";
import './InputInvoicePage.css'

const InvoiceRegisterPage = () => {
	const { Title } = Typography;
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
  
	// Стан із Redux
	const { 
	  	registers,
	  	loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedRegister,
		} = useSelector( (state) => state.registers );
  
	const { selectedRegisterIds	} = useSelector( (state) => state.reports );
  
   // Перевіряємо, чи сторінка викликана від Акта виконаних робіт
   const isForCompletionReport = location.state?.isForCompletionReport || false;
  
   // Завантаження Реєстрів
	useEffect(() => {
	  dispatch(fetchRegisters());
	}, [filters, pagination.current, pagination.pageSize]);
  
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
	  dispatch(fetchRegisters());
	};
  
	// Відкрити модальне вікно для створення/редагування Реєстру
	const handleOpenModal = (invoice = null) => {
	  dispatch(setSelectedRegister(invoice));
	  dispatch(toggleModal(true));
	};
  
	// Закрити модальне вікно
	const handleCloseModal = () => {
	  dispatch(toggleModal(false));
	  dispatch(setSelectedRegister(null));
	};
  
	// Обробка форми для створення/оновлення реєстру
	const handleFormSubmit = async (formData) => {
		try {
		  if (selectedRegister) {
			const resultAction = await dispatch(updateRegister({ id: selectedRegister.id, updates: formData })).unwrap();
			message.success(`Реєстр з ID ${resultAction.id} успішно оновлено.`);
		  } else {
			const resultAction = await dispatch(createRegister(formData)).unwrap();
			message.success(`Реєстр з ID ${resultAction.id} успішно створено.`);
		  }
		  dispatch(fetchRegisters());
		  handleCloseModal();
		} catch (error) {
		  if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
		  } else if (error.status === 400) {
			message.error(error.message || 'Помилка: невірні дані форми.');
		  } else if (error.status === 500) {
			message.error(error.message || 'Внутрішня помилка сервера. Спробуйте пізніше.');
		  } else {
			message.error(error.message || 'Сталася помилка.');
		  }
		  console.error('Помилка обробки форми:', error);
		}
	};
	  
	// Видалення Реєстра
	const handleDeleteRegister = async (record) => {
		let deletedId = null;
	  try {
		deletedId = await dispatch(deleteRegister(record.id)).unwrap();
		message.success(`Реєстр з ID ${deletedId} успішно видалено.`);
		dispatch(fetchRegisters());
	  } catch (error) {
		if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
			console.error('Помилка видалення:', error);
		} else if(error.status === 404) {
			message.error(error.message || `Реєстр з ID ${deletedId} не знайдено.`);
			console.error('Помилка видалення:', error);
		} else if(error.status === 400) {
			message.error(error.message || `Не вдалося видалити Реєстр з ID ${deletedId}.`);
			console.error('Помилка видалення:', error);
		} else if(error.status === 500) {
			message.error(error.message || `Внутрішня помилка сервера. Зверніться до адміністратора.`);
			console.error('Помилка видалення:', error);
		} else {
			message.error(error.message || 'Сталася помилка під час видалення Реєстру.');
			console.error('Помилка видалення:', error);
		  }
	  }
	};
  
	// Вибір Реєстрів для Акта виконаних робіт
	const handleAddToCompletionReport = () => {
		if (selectedRegisterIds.length > 0) {
			navigate(-1,);
			message.success(`Обрано ${selectedRegisterIds.length} Реєстрів.`);
		  } else {
			message.warning("Будь ласка, оберіть хоча б один Реєстр!");
		  }
	};

	return (
	  <div className="container">
		<Title level={1} className="page-title">
		  	Добові реєстри 
		</Title>
		<Title level={4} className="page-subtitle">
		  	прибуткових накладних з визначенням якості вхідної продукції за кожною накладною.
		</Title>
  
		<InvoiceRegisterFilterFields filters={filters} onFilterChange={handleFilterChange} />
  
		{/* Кнопка дії залежно від контексту */}
		{isForCompletionReport ? (
		  <Button
			className="action-button"
			disabled={selectedRegisterIds.length === 0}
			onClick={handleAddToCompletionReport}
		  >
			Додати до Акту виконаних робіт
		  </Button>
		) : (
		  <Button
			className="action-button"
			onClick={() => handleOpenModal(null)}
		  >
			Створити Реєстр
		  </Button>
		)}
  
		<InvoiceRegisterTable
		   invoiceRegisters={registers}
		   loading={loading}
		   pagination={pagination}
		   onTableChange={handleTableChange}
		   isForCompletionReport={isForCompletionReport} // Передаємо контекст
		   selectedRowKeys={selectedRegisterIds} // Стан вибору
		   onRowSelect={(selectedKeys) => dispatch(setSelectedRegisterIds(selectedKeys))} // Оновлення стану
		   handleOpenModal={isForCompletionReport ? undefined : handleOpenModal}
		   handleDeleteRegister={isForCompletionReport ? undefined : handleDeleteRegister}
		/>
  
		{!isForCompletionReport && (
		  <Modal
			title={selectedRegister ? 'Редагувати Реєстр' : 'Створити Реєстр'}
			open={isModalOpen}
			onCancel={handleCloseModal}
			footer={null}
		  >
			<InvoiceRegisterForm
			  key={selectedRegister ? selectedRegister.id : 'new'}
			  initialData={selectedRegister}
			  onSubmit={handleFormSubmit}
			  onCancel={handleCloseModal}
			  isEditing={!!selectedRegister} 
			/>
		  </Modal>
		)}
	  </div>
	);
  }
  
  export default InvoiceRegisterPage;