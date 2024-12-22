import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	fetchRegisters,
	createRegister,
	updateRegister,
	deleteRegister,
  } from '../asyncThunks/invoiceRegisterThunk';
import InvoiceRegisterFilterFields from '../components/InvoiceRegister/InvoiceRegisterFilterFields'
import InvoiceRegisterForm from '../components/InvoiceRegister/InvoiceRegisterForm'
import InvoiceRegisterTable from '../components/InvoiceRegister/InvoiceRegisterTable'
import { setFilters, setPagination, setSelectedRegister, setSort, toggleModal } from '../slices/invoiceRegisterSlice'
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
  
	// Локальний стан для вибору рядка таблиці
	const [selectedRegisterId, setSelectedRegisterId] = useState(null);
  
   // Перевіряємо, чи сторінка викликана від Акта виконаних робіт
   const isForCompletionReport = location.state?.isForCompletionReport || false;
  
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
  
	// Додавання чи оновлення Реєстра
	const handleFormSubmit = async (formData) => {
		console.log("Form submitted with data:", formData);
	  try {
		if (selectedRegister) {
		  const resultAction = await dispatch(updateRegister({ id: selectedRegister.id, updates: formData }));
		  if (updateRegister.fulfilled.match(resultAction)) {
			message.success('Реєстр оновлено.');
			dispatch(fetchRegisters());
		  } else {
			const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Реєстр.';
			message.error(errorMessage);
		  }
		} else {
		  await dispatch(createRegister(formData));
		  dispatch(fetchRegisters());
		  message.success('Реєстр створено.');
		}
		handleCloseModal();
	  } catch (error) {
		console.error('Помилка збереження:', error);
		message.error('Помилка збереження.');
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
  
	// Вибір Реєстру для Акта виконаних робіт
	const handleAddToCompletionReport = () => {
	  const selectedRegister = registers.find((reg) => reg.id === selectedRegisterId);
	  if (selectedRegister) {
		  dispatch(setSelectedRegister(selectedRegister)); // Зберігаємо вибір у Redux
		  navigate(-1); // Повертаємося назад
		} else {
		  message.warning('Будь ласка, оберіть Реєстр!');
		}
  };
  
  
	return (
	  <div className="container">
		<Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 20 }}>
		  Добові реєстри 
		</Title>
		<Title level={4} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
		  прибуткових накладних з визначенням якості по кожній накладній.
		</Title>
  
		<InvoiceRegisterFilterFields filters={filters} onFilterChange={handleFilterChange} />
  
		{/* Кнопка дії залежно від контексту */}
		{isForCompletionReport ? (
		  <Button
			type="primary"
			disabled={!selectedRegisterId}
			onClick={handleAddToCompletionReport}
			style={{ margin: 30, width: '10%' }}
		  >
			Додати в Акт виконаних робіт
		  </Button>
		) : (
		  <Button
			type="primary"
			onClick={() => handleOpenModal(null)}
			style={{ margin: 30, width: '10%' }}
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
		   selectedRowKeys={selectedRegisterId ? [selectedRegisterId] : []} // Стан вибору
		   onRowSelect={(selectedKeys) => setSelectedRegisterId(selectedKeys[0])} // Оновлення стану
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