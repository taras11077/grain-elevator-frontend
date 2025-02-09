import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createPriceList,
	deletePriceList,
	fetchPriceLists,
	updatePriceList,
} from '../asyncThunks/priceListThunk'
import PriceListFilterFields from '../components/PriceList/PriceListFilterFields'
import PriceListForm from '../components/PriceList/PriceListForm'
import PriceListTable from '../components/PriceList/PriceListTable'
import { setFilters, setPagination, setSelectedPriceList, setSort, toggleModal } from '../slices/priceListSlice'
import './InputInvoicePage.css'

const InputInvoicePage = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Стан із Redux
  const { 
	priceLists,
	loading, 
	 pagination, 
	 filters, 
	 isModalOpen, 
	 selectedPriceList,
	 } = useSelector( (state) => state.priceLists );

  // Локальний стан для вибору рядка таблиці
 const [selectedPriceListId, setSelectedPriceListId] = useState(null);

 // Перевіряємо, чи сторінка викликана від Акта виконаних робіт
 const isForCompletionReport = location.state?.isForCompletionReport || false;

  useEffect(() => {
    dispatch(fetchPriceLists());
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
    dispatch(fetchPriceLists());
  };

  // Відкрити модальне вікно для створення/редагування Прайс-листа
  const handleOpenModal = (list = null) => {
    dispatch(setSelectedPriceList(list));
    dispatch(toggleModal(true));
  };

  // Закрити модальне вікно
  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(setSelectedPriceList(null));
  };

  // Додавання чи оновлення прайс-листа
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedPriceList) {
        const resultAction = await dispatch(updatePriceList({ id: selectedPriceList.id, updates: formData }));
        if (updatePriceList.fulfilled.match(resultAction)) {
          message.success('Прайс-лист оновлено.');
        } else {
          const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Прайс-лист.';
          message.error(errorMessage);
        }
      } else {
        await dispatch(createPriceList(formData));
        message.success('Прайс-лист створено.');
      }
	  dispatch(fetchPriceLists());
      handleCloseModal();
    } catch (error) {
      console.error('Помилка збереження:', error);
      message.error('Помилка збереження.');
    }
  };

  // Видалення прайс-листа
  const handleDeletePriceList = async (record) => {
    try {
      await dispatch(deletePriceList(record.id));
      message.success('Прайс-лист успішно видалено!');
      dispatch(fetchPriceLists());
    } catch (error) {
      console.error('Помилка видалення:', error);
      message.error('Не вдалося видалити Прайс-лист.');
    }
  };

  // Вибір прайс-листа для Акта виконаних робіт
  const handleAddToCompletionReport = () => {
    const selectedPriceList = priceLists.find((list) => list.id === selectedPriceListId);
    if (selectedPriceList) {
		dispatch(setSelectedPriceList(selectedPriceList)); // Зберігаємо вибір у Redux
    	navigate(-1); // Повертаємося назад
	  } else {
		message.warning('Будь ласка, оберіть Прайс-лист!');
	  }
};

  return (
<div className="container container-slim">
	   <Title level={1} className="page-title">
			Прайс-листи 
		</Title>

		<Title level={4} className="page-subtitle">
			на послуги підприємства з доробки сільскогосподарскої продукції.
		</Title>

      <PriceListFilterFields filters={filters} onFilterChange={handleFilterChange} />

      {/* Кнопка дії залежно від контексту */}
      {isForCompletionReport ? (
        <Button
          className="action-button"
          disabled={!selectedPriceListId}
          onClick={handleAddToCompletionReport}
        >
          Додати до Акта виконаних робіт
        </Button>
      ) : (
        <Button
            className="action-button"
          	onClick={() => handleOpenModal(null)}
        >
          Створити Прайс-лист
        </Button>
      )}

      <PriceListTable
         priceLists={priceLists}
		 loading={loading}
		 pagination={pagination}
		 onTableChange={handleTableChange}
		 isForCompletionReport={isForCompletionReport} // Передаємо контекст
		 selectedRowKeys={selectedPriceListId ? [selectedPriceListId] : []} // Стан вибору
		 onRowSelect={(selectedKeys) => setSelectedPriceListId(selectedKeys[0])} // Оновлення стану
		 handleOpenModal={isForCompletionReport ? undefined : handleOpenModal}
		 handleDeletePriceList={isForCompletionReport ? undefined : handleDeletePriceList}
      />

      {!isForCompletionReport && (
        <Modal
          title={selectedPriceList ? 'Редагувати Прайс-лист' : 'Створити Прайс-лист'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
        >
          <PriceListForm
            key={selectedPriceList ? selectedPriceList.id : 'new'}
            initialData={selectedPriceList}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default InputInvoicePage;


