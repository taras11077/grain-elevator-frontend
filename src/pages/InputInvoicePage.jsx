import { Button, Modal, Table, Typography, message } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createInvoice, deleteInvoice, fetchInvoices, updateInvoice, } from '../asyncThunks/inputInvoiceThunk'
import InputInvoiceFilterFields from '../components/InputInvoice/InputInvoiceFilterFields'
import InputInvoiceForm from '../components/InputInvoice/InputInvoiceForm'
import { setPagination, setFilters, setSelectedInvoice, toggleModal } from '../slices/inputInvoiceSlice'
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


  const handleTableChange = (page, pageSize) => {
	dispatch(setPagination({ 
	  current: page, 
	  pageSize 
	}));
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
        await dispatch(updateInvoice({ id: selectedInvoice.id, formData }));
        message.success('Накладну оновлено.');
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

  const columns = [
    { title: '№', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Дата прибуття', dataIndex: 'arrivalDate', key: 'arrivalDate' },
    { title: 'Номер транспортного засобу', dataIndex: 'vehicleNumber', key: 'vehicleNumber' },
    { title: 'Фізична вага', dataIndex: 'physicalWeight', key: 'physicalWeight' },
    { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle' },
    { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle' },
    { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleOpenModal(record)}>Редагувати</Button>
          <Button type="link" danger onClick={() => handleDeleteInvoice(record)}>Видалити</Button>
        </div>
      ),
    },
  ];

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

      <Table
        dataSource={formattedInvoices}
        columns={columns}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
        }}
        loading={loading}
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







// import { Button, message, Modal, Table, Typography } from 'antd'
// import React, { useEffect, useState } from 'react'
// import api from '../api/axios'
// import InputInvoiceFilterFields from '../components/InputInvoice/InputInvoiceFilterFields'
// import InputInvoiceForm from '../components/InputInvoice/InputInvoiceForm'
// import './InputInvoicePage.css'
// import dayjs from 'dayjs';


// const InputInvoicePage = () => {
// 	const { Title } = Typography;

//     const [inputInvoices, setInputInvoices] = useState([]);
// 	const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//     const [loading, setLoading] = useState(false);
//     const [filters, setFilters] = useState({
//         id: '',
//         invoiceNumber: '',
//         arrivalDate: '',
//         vehicleNumber: '',
//         physicalWeight: '',
//         supplierTitle: '',
//         productTitle: '',
//         createdByName: '',
//         page: 1,
//         size: 10,
//     });
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedInvoice, setSelectedInvoice] = useState(null);

// 	const fetchInvoices = async (params) => {
// 		try {
// 			const response = await api.get('/input-invoice/search',{ params });
// 			setInputInvoices(response.data);
// 			setPagination((prev) =>({
//                 ...prev,
//                 total: parseInt(response.headers['x-total-count'], 10) || 100,
//             }));
// 		} catch (error) {
// 			console.error("Помилка клієнта під час завантаження накладних:", error);
// 		}
// 	};

// 	useEffect(() => {
//         fetchInvoices({
// 			...filters, 
// 			page: pagination.current, 
// 			size: pagination.pageSize,
// 		});
//     }, [filters, pagination.current, pagination.pageSize]);

// 	const handleTableChange = (pagination) => {
//         setPagination({
//             ...pagination,
//             current: pagination.current,
//             pageSize: pagination.pageSize,
//         });
//     };


//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleOpenModal = (invoice = null) => {
//         setSelectedInvoice(invoice);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedInvoice(null);
//     };

//     const handleFormSubmit = async (formData) => {
//         try {
//             if (selectedInvoice) {
//                 await api.put(`/input-invoice/${selectedInvoice.id}`, formData);
//                 alert('Накладну оновлено.');
//             } else {
//                 await api.post('/input-invoice', formData);
//                 alert('Накладну створено.');
//             }
//             fetchInvoices();
//             handleCloseModal();
//         } catch (error) {
//             console.error("Помилка під час збереження накладної:", error);
//         }
//     };

// 	const handleEditInvoice = (record) => {
// 		setSelectedInvoice(record); // вибір накладної для редагування
// 		setIsModalOpen(true); // відкриття модального вікна
//  	 };
  

//  	 const handleDeleteInvoice = async (record) => {
// 		try {
// 			await api.patch(`/api/input-invoice/${record.id}/soft-remove`);
// 			message.success('Накладну успішно видалено!');
// 			fetchInvoices(); // оновлення списку після видалення
// 		} catch (error) {
// 			console.error('Помилка під час видалення накладної:', error);
// 			message.error('Не вдалося видалити накладну.');
// 		}
//   };


//     const columns = [
//         {
//             title: '№',
//             dataIndex: 'invoiceNumber',
//             key: 'invoiceNumber',
//         },
//         {
//             title: 'Дата прибуття',
//             dataIndex: 'arrivalDate',
//             key: 'arrivalDate',
//         },
//         {
//             title: 'Номер транспортного засобу',
//             dataIndex: 'vehicleNumber',
//             key: 'vehicleNumber',
//         },
//         {
//             title: 'Фізична вага',
//             dataIndex: 'physicalWeight',
//             key: 'physicalWeight',
//         },
//         {
//             title: 'Продукція',
//             dataIndex: 'productTitle',
//             key: 'productTitle',
//         },
//         {
//             title: 'Постачальник',
//             dataIndex: 'supplierTitle',
//             key: 'supplierTitle',
//         },
// 		{
//             title: 'Автор документу',
//             dataIndex: 'createdByName',
//             key: 'createdByName',
//         },
// 		{
// 			title: 'Дії',
// 			key: 'actions',
// 			render: (_, record) => (
// 			  <div>
// 				<Button type="link" onClick={() => handleEditInvoice(record)}>
// 				  	Редагувати
// 				</Button>
// 				<Button type="link"	danger	onClick={() => handleDeleteInvoice(record)}>
// 				  	Видалити
// 				</Button>
// 			  </div>
// 			),
// 		  },
//     ];

// 	const formattedInvoices = inputInvoices.map((invoice) => ({
// 		...invoice,
// 		arrivalDate: dayjs(invoice.arrivalDate).format('DD-MM-YYYY'),
// 	}));

//     return (
//         <div className="container">
//            <Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
//                 Прибуткові накладні
//             </Title>

//             <InputInvoiceFilterFields filters={filters} onFilterChange={handleFilterChange} />

//             <Button type="primary" onClick={() => handleOpenModal(null)} style={{ margin: 30 }}>
//                 Створити накладну
//             </Button>

//             <Table 
// 				dataSource={formattedInvoices} 
// 				columns={columns} 
// 				rowKey="id"
// 				pagination={{
//                     current: pagination.current,
//                     pageSize: pagination.pageSize,
//                     total: pagination.total,
//                     onChange: (page, size) => fetchInvoices(page, size),
//                 }}
//                 loading={loading}
//                 onChange={handleTableChange}
// 				/>

//             <Modal
//                 title={selectedInvoice ? 'Редагувати накладну' : 'Створити накладну'}
//                 open={isModalOpen}
//                 onCancel={handleCloseModal}
//                 footer={null}
//             >
//                 <InputInvoiceForm
// 					key={selectedInvoice ? selectedInvoice.id : 'new'}
// 					initialData={selectedInvoice}
// 					onSubmit={(values) => {
// 						handleFormSubmit(values);
// 						handleCloseModal();
// 					}}
// 					onCancel={handleCloseModal}
//     			/>
//             </Modal>
//         </div>
//     );
// };

// export default InputInvoicePage;
