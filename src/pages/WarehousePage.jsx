import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	createWarehouseUnit,
	deleteWarehouseUnit,
	fetchWarehouseUnits,
	updateWarehouseUnit,
} from '../asyncThunks/warehouseThunk'
import WarehouseFilterFields from '../components/Warehouse/WarehouseFilterFields'
import WarehouseTable from '../components/Warehouse/WarehouseTable'
import WarehouseUnitForm from '../components/Warehouse/WarehouseUnitForm'
import { setFilters, setPagination, setSelectedWarehouseUnit, setSort, toggleModal } from '../slices/warehouseSlice'
import './InputInvoicePage.css'

const WarehousePage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	 // Стан із Redux
	 const { 
		warehouseUnits, 
		loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedWarehouseUnit 
	  } = useSelector((state) => state.warehouse);

	  // Локальний стан для вибору рядка таблиці
    const [selectedWarehouseUnitId, setSelectedWarehouseUnitId] = useState(null);
  
	// Завантаження складських юнітів
	useEffect(() => {
		dispatch(fetchWarehouseUnits());
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
		dispatch(fetchWarehouseUnits());
	  };
	
	  // Відкрити модальне вікно для створення/редагування складського юніта
	  const handleOpenModal = (unit = null) => {
		dispatch(setSelectedWarehouseUnit(unit));
		dispatch(toggleModal(true));
	  };
	
	  // Закрити модальне вікно
	  const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setSelectedWarehouseUnit(null));
	  };
	
	  // Додавання чи оновлення складського юніта
	  const handleFormSubmit = async (formData) => {
		try {
		  if (selectedWarehouseUnit) {
			const resultAction = await dispatch(updateWarehouseUnit({ id: selectedWarehouseUnit.id, updates: formData }));
			if (updateWarehouseUnit.fulfilled.match(resultAction)) {
			  message.success('Складський юніт оновлено.');
			  dispatch(fetchWarehouseUnits());
			} else {
			  const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Складський юніт.';
			  message.error(errorMessage);
			}
		  } else {
			try {
				await dispatch(createWarehouseUnit(formData)).unwrap();
				message.success('Складський юніт створено успішно.');
				dispatch(fetchWarehouseUnits());
			} catch (error) {
				message.error(error.message || 'Сталася помилка при створенні Складського юніта.');
			}
		  }
		  handleCloseModal();
		} catch (error) {
		  console.error('Помилка збереження:', error);
		  message.error('Помилка збереження.');
		}
	  };
	
	  // Видалення складського юніта
	  const handleDeleteWarehouseUnit = async (record) => {
		try {
		  const result = await dispatch(deleteWarehouseUnit(record.id)).unwrap();
		  message.success(`Складський юніт з ID ${result} успішно видалено!`);
		  dispatch(fetchWarehouseUnits());
		} catch (error) {
			console.error('Помилка видалення:', error);

			// Обробка специфічних помилок
			if (error.status === 400) {
				message.error(error.message || 'Помилка запиту. Неможливо видалити складський юніт.');
			} else if (error.status === 401) {
				message.error(error.message || 'Ви не авторизовані для виконання цієї дії.');
			} else if (error.status === 404) {
				message.error(error.message || `Складський юніт з ID ${record.id} не знайдено.`);
			} else if (error.status === 500) {
				message.error(error.message || 'Внутрішня помилка сервера.');
			} else {
				message.error(error.message || 'Невідома помилка під час видалення складського юніта.');
			}
		}
	  };

	  // відвантаження зі Складського юніта
	  const handleNavigateToOutputInvoice = (record, productCategory, isEditing, isFromWarehouse) => {
		navigate('/output-invoices', {
		  state: {
			initialData: {
				supplierTitle: record.supplierTitle,
				productTitle: record.productTitle,
				productCategory: productCategory.title,
				productWeight: productCategory.value,
		},
		isEditing, // Завжди false для створення нової накладної
		isFromWarehouse, // true, якщо дані передаються зі складу
	  },
	});
  };

	  return (
		<div className="container">
		  <Title level={1} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
			Склад
		  </Title>
	
		  <WarehouseFilterFields filters={filters} onFilterChange={handleFilterChange} />
	
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
			Створити Складський юніт
		  </Button>
	
		  <WarehouseTable
			warehouseUnits={warehouseUnits}
			loading={loading}
			pagination={pagination}
			onTableChange={handleTableChange}
			selectedRowKeys={selectedWarehouseUnitId ? [selectedWarehouseUnitId] : []} 
			onRowSelect={(selectedKeys) => setSelectedWarehouseUnitId(selectedKeys[0])}
			onEdit={handleOpenModal}
			onDelete={handleDeleteWarehouseUnit}
			onNavigateToOutputInvoice={handleNavigateToOutputInvoice}
		  />
	
		  <Modal
			title={selectedWarehouseUnit ? 'Редагувати Складський юніт' : 'Складський юніт'}
			open={isModalOpen}
			onCancel={handleCloseModal}
			footer={null}
		  >
			<WarehouseUnitForm
			  key={selectedWarehouseUnit ? selectedWarehouseUnit.id : 'new'}
			  initialData={selectedWarehouseUnit || {}}
			  onSubmit={handleFormSubmit}
			  onCancel={handleCloseModal}
			  isEditing={!!selectedWarehouseUnit}
			/>
		  </Modal>
		</div>
	  );
	};
	
	export default WarehousePage;