import { Button, message, Modal, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import InputInvoiceFilterFields from '../components/InputInvoice/InputInvoiceFilterFields'
import InputInvoiceForm from '../components/InputInvoice/InputInvoiceForm'
import './InputInvoicePage.css'


const InputInvoicePage = () => {
	const { Title } = Typography;

    const [inputInvoices, setInputInvoices] = useState([]);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        id: '',
        invoiceNumber: '',
        arrivalDate: '',
        vehicleNumber: '',
        physicalWeight: '',
        supplierTitle: '',
        productTitle: '',
        createdByName: '',
        page: 1,
        size: 10,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

	const fetchInvoices = async (params) => {
		try {
			const response = await api.get('/input-invoice/search',{ params });
			setInputInvoices(response.data);
			setPagination((prev) =>({
                ...prev,
                total: parseInt(response.headers['x-total-count'], 10) || 100,
            }));
		} catch (error) {
			console.error("Помилка клієнта під час завантаження накладних:", error);
		}
	};

	useEffect(() => {
        fetchInvoices({
			...filters, 
			page: pagination.current, 
			size: pagination.pageSize,
		});
    }, [filters, pagination.current, pagination.pageSize]);

	const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = (invoice = null) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedInvoice) {
                await api.put(`/api/input-invoice/${selectedInvoice.id}`, formData);
                alert('Накладну оновлено.');
            } else {
                await api.post('/api/input-invoice', formData);
                alert('Накладну створено.');
            }
            fetchInvoices();
            handleCloseModal();
        } catch (error) {
            console.error("Помилка під час збереження накладної:", error);
        }
    };

	const handleEditInvoice = (record) => {
		setSelectedInvoice(record); // вибір накладної для редагування
		setIsModalOpen(true); // відкриття модального вікна
 	 };
  

 	 const handleDeleteInvoice = async (record) => {
		try {
			await api.patch(`/api/input-invoice/${record.id}/soft-remove`);
			message.success('Накладну успішно видалено!');
			fetchInvoices(); // оновлення списку після видалення
		} catch (error) {
			console.error('Помилка під час видалення накладної:', error);
			message.error('Не вдалося видалити накладну.');
		}
  };


    const columns = [
        {
            title: '№',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'Дата',
            dataIndex: 'arrivalDate',
            key: 'arrivalDate',
        },
        {
            title: 'Номер транспортного засобу',
            dataIndex: 'vehicleNumber',
            key: 'vehicleNumber',
        },
        {
            title: 'Фізична вага',
            dataIndex: 'physicalWeight',
            key: 'physicalWeight',
        },
        {
            title: 'Продукція',
            dataIndex: 'productTitle',
            key: 'productTitle',
        },
        {
            title: 'Постачальник',
            dataIndex: 'supplierTitle',
            key: 'supplierTitle',
        },
		{
            title: 'Автор документу',
            dataIndex: 'createdByName',
            key: 'createdByName',
        },
		{
			title: 'Дії',
			key: 'actions',
			render: (_, record) => (
			  <div>
				<Button type="link" onClick={() => handleEditInvoice(record)}>
				  	Редагувати
				</Button>
				<Button type="link"	danger	onClick={() => handleDeleteInvoice(record)}>
				  	Видалити
				</Button>
			  </div>
			),
		  },
    ];

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
				dataSource={inputInvoices} 
				columns={columns} 
				rowKey="id"
				pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, size) => fetchInvoices(page, size),
                }}
                loading={loading}
                onChange={handleTableChange}
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
					onSubmit={(values) => {
						handleFormSubmit(values);
						handleCloseModal();
					}}
					onCancel={handleCloseModal}
    			/>
            </Modal>
        </div>
    );
};

export default InputInvoicePage;




// const InputInvoicePage = () => {
//     const [inputInvoices, setInputInvoices] = useState([]);
//     const [filters, setFilters] = useState({
//         id: '',
//         invoiceNumber: '',
//         arrivalDate: '',
//         vehicleNumber: '',
//         physicalWeight: '',
//         supplier: '',
//         product: '',
//         createdByName: '',
//         removedAt: '',
//         page: 1,
//         size: 10,
//     });
//     const [selectedInvoice, setSelectedInvoice] = useState(null);

//     // Завантаження накладних
//     const fetchInvoices = async () => {
//         try {
//             const response = await api.get('/api/input-invoice/search', { params: filters });
//             setInputInvoices(response.data);
//         } catch (error) {
//             console.error("Помилка під час завантаження накладних:", error);
//         }
//     };

//     // Завантаження накладних при зміні фільтрів
//     useEffect(() => {
//         fetchInvoices();
//     }, [filters]);

//     // Оновлення фільтрів
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters((prev) => ({ ...prev, [name]: value }));
//     };

//     // Вибір накладної
//     const handleSelectInvoice = (invoice) => {
//         setSelectedInvoice(invoice);
//     };

//     // Дії з накладними
//     const handleCreateInvoice = () => {
//         console.log("Створення нової накладної...");
//     };

//     const handleEditInvoice = () => {
//         if (selectedInvoice) {
//             console.log("Редагування накладної:", selectedInvoice);
//         } else {
//             alert("Будь ласка, виберіть накладну для редагування.");
//         }
//     };

//     const handleDeleteInvoice = async () => {
//         if (selectedInvoice) {
//             try {
//                 await api.delete(`/api/input-invoice/${selectedInvoice.id}`);
//                 alert("Накладну видалено.");
//                 fetchInvoices(); // оновити список
//             } catch (error) {
//                 console.error("Помилка під час видалення накладної:", error);
//             }
//         } else {
//             alert("Будь ласка, виберіть накладну для видалення.");
//         }
//     };

//     const handleCreateLabCard = () => {
//         if (selectedInvoice) {
//             console.log("Створення лабораторної карти на базі накладної:", selectedInvoice);
//         } else {
//             alert("Будь ласка, виберіть накладну для створення лабораторної карти.");
//         }
//     };

//     return (
//         <div>
//             <h2>Список Прибуткових Накладних</h2>

//             {/* Поля для фільтрації */}
// 			<InputInvoiceFilterFields filters={filters} onFilterChange={handleFilterChange} />

//             {/* Таблиця накладних */}
//             <table>
//                 <thead>
//                     <tr>
//                         <th>№</th>
//                         <th>Дата</th>
//                         <th>Транспорт</th>
//                         <th>Вага</th>
// 						<th>Продукція</th>
//                         <th>Постачальник</th>
//                         <th>Створено</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {inputInvoices.map((invoice) => (
//                         <InputInvoiceItem
//                             key={invoice.id}
//                             invoice={invoice}
//                             isSelected={selectedInvoice?.id === invoice.id}
//                             onSelect={handleSelectInvoice}
//                         />
//                     ))}
//                 </tbody>
//             </table>

//             {/* Панель дій */}
//             <div>
//                 <button onClick={handleCreateInvoice}>Створити накладну</button>
//                 <button onClick={handleDeleteInvoice}>Видалити накладну</button>
//             </div>

// 			<div>
//                 <button onClick={handleCreateLabCard}>Створити лабораторну карту</button>
//             </div>
//         </div>
//     );
// };

// export default InputInvoicePage;

