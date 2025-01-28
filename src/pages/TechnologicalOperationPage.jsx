import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createTechnologicalOperation,
	deleteTechnologicalOperation,
	fetchTechnologicalOperations,
	updateTechnologicalOperation
} from '../asyncThunks/technologicalOperationThunk'
import TechnologicalOperationFilterFields from '../components/TechnologicalOperation/TechnologicalOperationFilterFields'
import TechnologicalOperationForm from '../components/TechnologicalOperation/TechnologicalOperationForm'
import TechnologicalOperationTable from '../components/TechnologicalOperation/TechnologicalOperationTable'
import { setFilters, setPagination, setSelectedOperation, setSort, toggleModal } from '../slices/technologicalOperationSlice'
import { setSelectedOperationIds } from "../slices/completionReportSlice";
import './InputInvoicePage.css'

const TechnologicalOperationPage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	 // Стан із Redux
	 const { 
		technologicalOperations, 
		loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedOperation, 
	  } = useSelector((state) => state.technologicalOperations);

	const { selectedOperationIds = [] } = useSelector((state) => state.reports || {});

	 // Перевіряємо, чи сторінка викликана від Акта виконаних робіт
	 const isForCompletionReport = location.state?.isForCompletionReport || false;
  
	// Завантаження Технологичних операцій
	useEffect(() => {
		dispatch(fetchTechnologicalOperations());
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
		dispatch(fetchTechnologicalOperations());
	  };
	
	  // Відкрити модальне вікно для створення/редагування Технологичної операції
	  const handleOpenModal = (operation = null) => {
		dispatch(setSelectedOperation(operation));
		dispatch(toggleModal(true));
	  };
	
	  // Закрити модальне вікно
	  const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setSelectedOperation(null));
	  };
	
	  // Додавання чи оновлення Технологичної операції
	  const handleFormSubmit = async (formData) => {
		try {
		  if (selectedOperation) {
				const resultAction = await dispatch(updateTechnologicalOperation({ id: selectedOperation.id, updates: formData })).unwrap();
			  	message.success(`Технологичну операцію з ID ${resultAction.id} успішно оновлено.`);
		  } else {
				const resultAction = await dispatch(createTechnologicalOperation(formData)).unwrap();
				message.success(`Технологичну операцію з ID ${resultAction.id} успішно створено.`);
		  }
		  dispatch(fetchTechnologicalOperations());
		  handleCloseModal();
		} catch (error) {
			handleError(error);
		}
	  };
	
	  // Видалення Технологичної операції
	  const handleDeleteTechnologicalOperation = async (record) => {
		let deletedOperation = null;
		try {
		  deletedOperation = await dispatch(deleteTechnologicalOperation(record.id)).unwrap();
		  message.success(`Технологичну операцію ${deletedOperation.title} успішно видалено!`);
		  dispatch(fetchTechnologicalOperations());
		} catch (error) {
			handleError(error);
		};
	  }

	  // Обробка помилок
		const handleError = (error) => {
			if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
			} else if(error.status === 404) {
				message.error(error.message || `Таку Технологичну операцію не знайдено.`);
			} else if (error.status === 400) {
				message.error(error.message || 'Помилка: невірні дані форми.');
			} else if (error.status === 500) {
				message.error(error.message || 'Внутрішня помилка сервера. Спробуйте пізніше.');
			} else {
				message.error(error.message || 'Сталася помилка.');
			}
			console.error('Помилка:', error);
		};

		// Вибір Технологичних операцій для Акта виконаних робіт
			const handleAddToCompletionReport = () => {
				if (selectedOperationIds.length > 0) {
					navigate(-1,);
					message.success(`Обрано ${selectedOperationIds.length} Технологичних операцій.`);
				  } else {
					message.warning("Будь ласка, оберіть хоча б одну Технологичну операцію!");
				  }
			};

	  return (
		<div className="container container-slim">
		   <Title level={1} className="page-title">
		  		Технологичні операції 
			</Title>

			<Title level={4} className="page-subtitle">
				з доробки продукції, доступні на наявному обладнанні підприємства.
			</Title>
	
			<TechnologicalOperationFilterFields filters={filters} onFilterChange={handleFilterChange} />
		
{/* Кнопка дії залежно від контексту */}
		{isForCompletionReport ? (
		  <Button
			 className="action-button"
			disabled={selectedOperationIds.length === 0}
			onClick={handleAddToCompletionReport}
		  >
			Додати до Акту виконаних робіт
		  </Button>
		) : (
			<Button 
			className="action-button"
			onClick={() => handleOpenModal(null)} 
			>
			Створити технологичну операцію
			</Button>
		)}
			<TechnologicalOperationTable
				technologicalOperations={technologicalOperations}
				loading={loading}
				pagination={pagination}
				onTableChange={handleTableChange}
				isForCompletionReport={isForCompletionReport} // Передаємо контекст
				//selectedRowKeys={selectedOperationIds ? [selectedOperationIds] : []}
				selectedRowKeys={selectedOperationIds}
				onRowSelect={(selectedKeys) => dispatch(setSelectedOperationIds(selectedKeys))} // Оновлення стану
				handleOpenModal={isForCompletionReport ? undefined : handleOpenModal}
				handleDeleteTechnologicalOperation={isForCompletionReport ? undefined : handleDeleteTechnologicalOperation}
			/>

		{!isForCompletionReport && (
			<Modal
				title={selectedOperation ? 'Редагувати Технологичну операцію' : 'Створити Технологичну операцію'}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={null}
			>
				<TechnologicalOperationForm
				key={selectedOperation ? selectedOperation.id : 'new'}
				initialData={selectedOperation || {}}
				onSubmit={handleFormSubmit}
				onCancel={handleCloseModal}
				isEditing={!!selectedOperation}
				/>
			</Modal>
		)}
		</div>
	  );
	};
	
	export default TechnologicalOperationPage;