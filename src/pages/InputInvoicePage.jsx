import { Button, Modal, Table, Typography, message } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createInvoice, deleteInvoice, fetchInvoices, updateInvoice, } from '../asyncThunks/inputInvoiceThunk'
import InputInvoiceFilterFields from '../components/InputInvoice/InputInvoiceFilterFields'
import InputInvoiceForm from '../components/InputInvoice/InputInvoiceForm'
import InputInvoiceTable from '../components/InputInvoice/InputInvoiceTable'
import { setPagination, setSort, setFilters, setSelectedInvoice, toggleModal } from '../slices/inputInvoiceSlice'
import './InputInvoicePage.css'


const InputInvoicePage = () => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const {
    invoices,
    loading,
    pagination,
    filters,
    isModalOpen,
    selectedInvoice,
  } = useSelector((state) => state.inputInvoice);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [filters, pagination.current, pagination.pageSize]);


  const handleTableChange = (pagination, _, sorter) => {
	  const sortField = sorter?.field || null;
	  const sortOrder = sorter?.order === 'ascend' ? 'asc' : 'desc';
	  dispatch(setSort({ sortField, sortOrder }));
	  dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
	  dispatch(fetchInvoices());
	};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleOpenModal = (invoice = null) => {
    dispatch(setSelectedInvoice(invoice));
    dispatch(toggleModal(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(setSelectedInvoice(null));
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedInvoice) {
        const resultAction = await dispatch(updateInvoice({ id: selectedInvoice.id, updates: formData }));
		// якщо запит виконано успішно
		if (updateInvoice.fulfilled.match(resultAction)) {
				message.success('Прибуткову накладну оновлено.');
				dispatch(fetchInvoices()); // оновлення списку накладних
		} else if (resultAction.payload && resultAction.payload.message) {
				//якщо запит виконано з помилкою, показуємо повідомлення від сервера
				const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Прибуткову накладну.';
				message.error(errorMessage);
		} else {
				message.error('Сталася помилка. Прибуткову накладну не оновлено.');
		}	
      } else {
        await dispatch(createInvoice(formData));
        message.success('Накладну створено.');
      }
      dispatch(fetchInvoices());
      handleCloseModal();
    } catch (error) {
      console.error('Помилка під час збереження накладної:', error);
      message.error('Помилка збереження.');
    }
  };

  const handleDeleteInvoice = async (record) => {
    try {
      await dispatch(deleteInvoice(record.id));
      message.success('Накладну успішно видалено!');
    } catch (error) {
      console.error('Помилка під час видалення накладної:', error);
      message.error('Не вдалося видалити накладну.');
    }
  };

	  const formattedInvoices = invoices.map((invoice) => ({
		...invoice,
		arrivalDate: dayjs(invoice.arrivalDate).format('DD-MM-YYYY'),
	  }));
	
	  return (
		<div className="container">
		  <Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
			Прибуткові накладні
		  </Title>
	
		  <InputInvoiceFilterFields filters={filters} onFilterChange={handleFilterChange} />
	
		  <Button type="primary" onClick={() => handleOpenModal(null)} style={{ margin: 30 }}>
			Створити накладну
		  </Button>
	
		  <InputInvoiceTable
			invoices={invoices}
			loading={loading}
			pagination={pagination}
			onTableChange={handleTableChange}
			onEdit={handleOpenModal}
			onDelete={handleDeleteInvoice}
		  />
	
		  <Modal
			title={selectedInvoice ? 'Редагувати накладну' : 'Створити накладну'}
			open={isModalOpen}
			onCancel={handleCloseModal}
			footer={null}
		  >
			<InputInvoiceForm
			  key={selectedInvoice ? selectedInvoice.id : 'new'}
			  initialData={selectedInvoice}
			  onSubmit={handleFormSubmit}
			  onCancel={handleCloseModal}
			/>
		  </Modal>
		</div>
	  );
	};
	
	export default InputInvoicePage;