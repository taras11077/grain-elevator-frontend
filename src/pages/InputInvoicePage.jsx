import { Button, Modal, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createInvoice,
	deleteInvoice,
	fetchInvoices,
	updateInvoice,
} from '../asyncThunks/inputInvoiceThunk'
import InputInvoiceFilterFields from '../components/InputInvoice/InputInvoiceFilterFields'
import InputInvoiceForm from '../components/InputInvoice/InputInvoiceForm'
import InputInvoiceTable from '../components/InputInvoice/InputInvoiceTable'
import { setFilters, setPagination, setSelectedInvoice, setSort, toggleModal } from '../slices/inputInvoiceSlice'
import './InputInvoicePage.css'

const InputInvoicePage = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Стан із Redux
  const { 
	invoices,
	loading, 
	 pagination, 
	 filters, 
	 isModalOpen, 
	 selectedInvoice,
	 } = useSelector( (state) => state.inputInvoice );

  // Локальний стан для вибору рядка таблиці
 const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

 // Перевіряємо, чи сторінка викликана від лабораторної карти
 const isForLabCard = location.state?.isForLabCard || false;

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (selectedInvoice) {
        dispatch(setSelectedInvoice(selectedInvoice));
    }
}, [selectedInvoice, dispatch]);

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
        message.success('Прибуткову накладну оновлено.');
      } else {
        const errorMessage = extractErrorMessage(resultAction.payload, 'Не вдалося оновити накладну.');
        message.error(errorMessage);
      }
    } else {
      const resultAction = await dispatch(createInvoice(formData));
      if (createInvoice.fulfilled.match(resultAction)) {
        message.success('Накладну створено.');
      } else {
        const errorMessage = extractErrorMessage(resultAction.payload, 'Не вдалося створити накладну.');
        message.error(errorMessage);
      }
    }
	setTimeout(() => {
		dispatch(fetchInvoices());
		handleCloseModal();
		}, 0);
  } catch (error) {
    console.error('Помилка збереження:', error);
    message.error('Сталася неочікувана помилка.');
  }
};

//   const handleFormSubmit = async (formData) => {
//   try {
//     if (selectedInvoice) {
//       const resultAction = await dispatch(updateInvoice({ id: selectedInvoice.id, updates: formData }));
//       if (updateInvoice.fulfilled.match(resultAction)) {
//         message.success('Прибуткову накладну оновлено.');
//       } else {
//         const errorMessage = resultAction.payload?.message || 'Не вдалося оновити накладну.';
//         message.error(errorMessage);
//       }
//     } else {
//       const resultAction = await dispatch(createInvoice(formData));
//       if (createInvoice.fulfilled.match(resultAction)) {
//         message.success('Накладну створено.');
//       } else {
//         let errorMessage = 'Не вдалося створити накладну.';
//         if (resultAction.payload) {
//           if (typeof resultAction.payload === 'object') {
//             const firstError = Object.values(resultAction.payload)[0];
//             if (Array.isArray(firstError)) {
//               errorMessage = firstError[0];
//             } else {
//               errorMessage = firstError;
//             }
//           } else if (typeof resultAction.payload === 'string') {
//             errorMessage = resultAction.payload;
//           }
//         }
//         message.error(errorMessage);
//       }
//     }
//     // Затримка перед оновленням стану
//     setTimeout(() => {
//       dispatch(fetchInvoices());
//       handleCloseModal();
//     }, 0);

//   } catch (error) {
//     console.error('Помилка збереження:', error);
//     message.error('Помилка збереження.');
//   }
// };


function extractErrorMessage(payload, defaultMsg) {
  if (!payload) return defaultMsg;
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  // якщо це об'єкт ModelState з помилками
  const firstError = Object.values(payload)[0];
  if (Array.isArray(firstError)) return firstError[0];
  if (typeof firstError === 'string') return firstError;
  return defaultMsg;
}


  // Видалення накладної
  const handleDeleteInvoice = async (record) => {
    try {
      await dispatch(deleteInvoice(record.id));
      message.success('Накладну успішно видалено!');
      dispatch(fetchInvoices());
    } catch (error) {
      console.error('Помилка видалення:', error);
      message.error('Не вдалося видалити накладну.');
    }
  };

  // Вибір накладної для лабораторної карти
  const handleAddToLabCard = () => {
    const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
    if (selectedInvoice) {
		dispatch(setSelectedInvoice(selectedInvoice)); // Зберігаємо вибір у Redux
    	navigate(-1); // Повертаємося назад
	  } else {
		message.warning('Будь ласка, оберіть накладну!');
	  }
};

  return (
	<div className="container container-slim">
	   <Title level={1} className="page-title">
	  		Прибуткові накладні 
		</Title>

		<Title level={4} className="page-subtitle">
			на однорідну партію продукції, поставлену окремим транспортним засобом.
		</Title>

      <InputInvoiceFilterFields filters={filters} onFilterChange={handleFilterChange} />

      {/* Кнопка дії залежно від контексту */}
      {isForLabCard ? (
        <Button
          disabled={!selectedInvoiceId}
          onClick={handleAddToLabCard}
          className="action-button"
        >
           Додати в лабораторну картку
        </Button>
      ) : (
        <Button
          onClick={() => handleOpenModal(null)}
		  className="action-button"
        >
          	Створити прибуткову накладну
        </Button>
      )}


      <InputInvoiceTable
         invoices={invoices}
		 loading={loading}
		 pagination={pagination}
		 onTableChange={handleTableChange}
		 isForLabCard={isForLabCard} // Передаємо контекст
		 selectedRowKeys={selectedInvoiceId ? [selectedInvoiceId] : []} // Стан вибору
		 onRowSelect={(selectedKeys) => setSelectedInvoiceId(selectedKeys[0])} // Оновлення стану
		 onEdit={isForLabCard ? undefined : handleOpenModal}
		 onDelete={isForLabCard ? undefined : handleDeleteInvoice}
      />

      {!isForLabCard && (
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
      )}
    </div>
  );
}

export default InputInvoicePage;
