import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createInvoice,
	deleteInvoice,
	fetchInvoices,
	updateInvoice,
} from '../asyncThunks/outputInvoiceThunk'
import OutputInvoiceFilterFields from '../components/OutputInvoice/OutputInvoiceFilterFields'
import OutputInvoiceForm from '../components/OutputInvoice/OutputInvoiceForm'
import OutputInvoiceTable from '../components/OutputInvoice/OutputInvoiceTable'
import { setFilters, setPagination, setSelectedInvoice, setSort, toggleModal } from '../slices/outputInvoiceSlice'
import './InputInvoicePage.css'

const OutputInvoicePage = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Стан із Redux
  const { 
	outputInvoices,
	loading, 
	 pagination, 
	 filters, 
	 isModalOpen, 
	 selectedInvoice,
	 } = useSelector( (state) => state.outputInvoices );

  // Локальний стан для вибору рядка таблиці
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoices());
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
    dispatch(fetchInvoices());
  };

  // Відкрити модальне вікно для створення/редагування накладної
  const handleOpenModal = (invoice = null) => {
    dispatch(setSelectedInvoice(invoice));
    dispatch(toggleModal(true));
  };

  // Закрити модальне вікно
  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(setSelectedInvoice(null));
  };

  // Додавання чи оновлення накладної
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedInvoice) {
        const resultAction = await dispatch(updateInvoice({ id: selectedInvoice.id, updates: formData }));
        if (updateInvoice.fulfilled.match(resultAction)) {
          message.success('Видаткову накладну оновлено.');
          dispatch(fetchInvoices());
        } else {
          const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Видаткову накладну.';
          message.error(errorMessage);
        }
      } else {
        await dispatch(createInvoice(formData));
        message.success('Видаткову накладну створено.');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Помилка збереження:', error);
      message.error('Помилка збереження.');
    }
  };

  // Видалення накладної
  const handleDeleteInvoice = async (record) => {
    try {
      await dispatch(deleteInvoice(record.id));
      message.success('Видаткову накладну успішно видалено!');
      dispatch(fetchInvoices());
    } catch (error) {
      console.error('Помилка видалення:', error);
      message.error('Не вдалося видалити Видаткову накладну.');
    }
  };



  return (
    <div className="container">
      <Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
        Видаткові накладні
      </Title>

      <OutputInvoiceFilterFields filters={filters} onFilterChange={handleFilterChange} />

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
			Створити видаткову накладну
		</Button>

      <OutputInvoiceTable
         outputInvoices={outputInvoices}
		 loading={loading}
		 pagination={pagination}
		 onTableChange={handleTableChange}
		 selectedRowKeys={selectedInvoiceId ? [selectedInvoiceId] : []} // Стан вибору
		 onRowSelect={(selectedKeys) => setSelectedInvoiceId(selectedKeys[0])} // Оновлення стану
		 onEdit={ handleOpenModal}
		 onDelete={handleDeleteInvoice}
      />

        <Modal
          title={selectedInvoice ? 'Редагувати накладну' : 'Створити накладну'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
        >
          <OutputInvoiceForm
            key={selectedInvoice ? selectedInvoice.id : 'new'}
            initialData={selectedInvoice}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
			isEditing={!!selectedInvoice} 
          />
        </Modal>

    </div>
  );
}

export default OutputInvoicePage;
