import { Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Стан із Redux
  const { 
	warehouseUnits,
	loading, 
	 pagination, 
	 filters, 
	 isModalOpen, 
	 selectedWarehouseUnit,
	 } = useSelector( (state) => state.outputInvoices );

  // Локальний стан для вибору рядка таблиці
  const [selectedWarehouseUnitId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    dispatch(fetchWarehouseUnits());
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
    dispatch(fetchWarehouseUnits());
  };

  // Відкрити модальне вікно для створення/редагування накладної
  const handleOpenModal = (invoice = null) => {
    dispatch(setSelectedWarehouseUnit(invoice));
    dispatch(toggleModal(true));
  };

  // Закрити модальне вікно
  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(setSelectedWarehouseUnit(null));
  };

  // Додавання чи оновлення накладної
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
        await dispatch(createWarehouseUnit(formData));
        message.success('Складський юніт створено.');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Помилка збереження:', error);
      message.error('Помилка збереження.');
    }
  };

  // Видалення накладної
  const handleDeleteWarehouseUnit = async (record) => {
    try {
      await dispatch(deleteWarehouseUnit(record.id));
      message.success('Складський юніт успішно видалено!');
      dispatch(fetchWarehouseUnits());
    } catch (error) {
      console.error('Помилка видалення:', error);
      message.error('Не вдалося видалити Складський юніт.');
    }
  };



  return (
    <div className="container">
      <Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
		Склад
      </Title>

      <WarehouseFilterFields filters={filters} onFilterChange={handleFilterChange} />

      <WarehouseTable
         warehouseUnits={warehouseUnits}
		 loading={loading}
		 pagination={pagination}
		 onTableChange={handleTableChange}
		 selectedRowKeys={selectedWarehouseUnitId ? [selectedWarehouseUnitId] : []} // Стан вибору
		 onRowSelect={(selectedKeys) => setSelectedWarehouseUnit(selectedKeys[0])} // Оновлення стану
		 onEdit={ handleOpenModal}
		 onDelete={handleDeleteWarehouseUnit}
      />

        <Modal
          title={selectedWarehouseUnit ? 'Редагувати Складський юніт' : 'Складський юніт'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
        >
          <WarehouseUnitForm
            key={selectedWarehouseUnit ? selectedWarehouseUnit.id : 'new'}
            initialData={selectedWarehouseUnit}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
			isEditing={!!selectedWarehouseUnit} 
          />
        </Modal>

    </div>
  );
}

export default WarehousePage;
