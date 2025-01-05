import { Button, Modal, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	createCompletionReport,
	deleteCompletionReport,
	fetchCompletionReports,
	updateCompletionReport,
} from '../asyncThunks/completionReportThunk';
import CompletionReportFilterFields from '../components/CompletionReport/CompletionReportFilterFields';
import CompletionReportForm from '../components/CompletionReport/CompletionReportForm';
import CompletionReportTable from '../components/CompletionReport/CompletionReportTable';
import { setFilters, setPagination, setSelectedReport, setSort, toggleModal } from '../slices/completionReportSlice';
import './InputInvoicePage.css';


const CompletionReportPage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Стан із Redux
	const { 
		reports = [],
	  	loading, 
		pagination = { current: 1, pageSize: 10, total: 0 },
		filters, 
		isModalOpen, 
		selectedReport,
		} = useSelector((state) => state.reports || {});
  
	// Локальний стан для вибору рядка таблиці
	const [selectedReportId, setSelectedReportId] = useState(null);

	// Завантаження Актів виконаних робіт
	useEffect(() => {
		dispatch(fetchCompletionReports());
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
	  dispatch(fetchCompletionReports());
	};
  
	// Відкрити модальне вікно для створення/редагування Акта виконаних робіт
	const handleOpenModal = (report = null) => {
	  dispatch(setSelectedReport(report));
	  dispatch(toggleModal(true));
	};
  
	// Закрити модальне вікно
	const handleCloseModal = () => {
	  dispatch(toggleModal(false));
	  dispatch(setSelectedReport(null));
	};
  
	// Додавання чи оновлення Акта виконаних робіт
	const handleFormSubmit = async (formData) => {
		try {
			if (selectedReport) {
				const resultAction = await dispatch(updateCompletionReport({ id: selectedReport.id, updates: formData })).unwrap();
				message.success(`Акт виконаних робіт з ID ${resultAction.id} успішно оновлено.`);
			} else {
				const resultAction = await dispatch(createCompletionReport(formData)).unwrap();
				message.success(`Акт виконаних робіт ${resultAction.id} успішно створено.`);
			}
			dispatch(fetchCompletionReports());
			handleCloseModal();
		} catch (error) {
			handleError(error);
	    };
	};
	  
	// Видалення Акта виконаних робіт
	const handleDeleteReport = async (record) => {
		let deletedReport = null;
	  try {
			deletedReport = await dispatch(deleteCompletionReport(record.id)).unwrap();
			message.success(`Акт виконаних робіт за номером ${deletedReport.reportNumber} від ${deletedReport.reportDate} успішно видалено.`);
			dispatch(fetchCompletionReports());
	  } catch (error) {
		handleError(error);
		};
	}

	// Обробка помилок
	const handleError = (error) => {
		if (error.status === 401) {
		message.error(error.message || 'Ви не авторизовані.');
		} else if(error.status === 404) {
			message.error(error.message || `Такого Акта виконаних робіт не знайдено.`);
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
		<Title 
			level={1} 
			style={{ textAlign: 'center', color: 'steelblue', margin: 20 }}
			>
		  	Акти виконаних робіт
		</Title>

		<Title 
			level={4} 
			style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}
			>
			на послуги з доробки продукції з розрахунком вартості робіт згідно з Договором на доробку.
		</Title>
  
		<CompletionReportFilterFields filters={filters} onFilterChange={handleFilterChange} />
  
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
			Створити Акт виконаних робіт
		</Button>
		
		<CompletionReportTable
		   reports={reports}
		   loading={loading}
		   pagination={pagination}
		   onTableChange={handleTableChange}
		   selectedRowKeys={selectedReportId ? [selectedReportId] : []} // Стан вибору
		   onRowSelect={(selectedKeys) => setSelectedReportId(selectedKeys[0])} // Оновлення стану
		   handleOpenModal={handleOpenModal}
		   handleDeleteReport={handleDeleteReport}
		/>
  
		  <Modal
			title={selectedReport ? 'Редагувати Акт виконаних робіт' : 'Створити Акт виконаних робіт'}
			open={isModalOpen}
			onCancel={handleCloseModal}
			footer={null}
		  >
			<CompletionReportForm
			  key={selectedReportId ? selectedReportId.id : 'new'}
			  initialData={selectedReport}
			  onSubmit={handleFormSubmit}
			  onCancel={handleCloseModal}
			  isEditing={!!selectedReport}
			/>
		  </Modal>
	  </div>
	);
}

export default CompletionReportPage;