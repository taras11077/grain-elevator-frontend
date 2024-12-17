import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLaboratoryCard, deleteLaboratoryCard, fetchLaboratoryCards, updateLaboratoryCard, } from '../asyncThunks/laboratoryCardThunk'
import LaboratoryCardFilterFields from '../components/LaboratoryCard/LaboratoryCardFilterFields'
import LaboratoryCardForm from '../components/LaboratoryCard/LaboratoryCardForm'
import LaboratoryCardsTable from '../components/LaboratoryCard/LaboratoryCardsTable'

import { setFilters, setPagination, setSelectedCard, setSort, toggleModal } from '../slices/laboratoryCardSlice'
import './InputInvoicePage.css'


const LaboratoryCardPage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();
	const {
	  laboratoryCards,
	  loading,
	  pagination,
	  filters,
	  isModalOpen,
	  selectedCard,
	} = useSelector((state) => state.laboratoryCards);
  
	useEffect(() => {
	  dispatch(fetchLaboratoryCards());
	}, [filters, pagination.current, pagination.pageSize]);
  
	const handleTableChange = (pagination, _, sorter) => {
	  const sortField = sorter?.field || null;
	  const sortOrder = sorter?.order === 'ascend' ? 'asc' : 'desc';
	  dispatch(setSort({ sortField, sortOrder }));
	  dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
	  dispatch(fetchLaboratoryCards());
	};
  
	const handleFilterChange = (e) => {
	  const { name, value } = e.target;
	  dispatch(setFilters({ [name]: value }));
	};
  
	const handleOpenModal = (card = null) => {
	  dispatch(setSelectedCard(card));
	  dispatch(toggleModal(true));
	};
  
	const handleCloseModal = () => {
	  dispatch(toggleModal(false));
	  dispatch(setSelectedCard(null));
	};
  
	const handleFormSubmit = async (formData) => {
	  try {
		if (selectedCard) {
			const resultAction = await dispatch(updateLaboratoryCard({ id: selectedCard.id, updates: formData }));
			// якщо запит виконано успішно
			if (updateLaboratoryCard.fulfilled.match(resultAction)) {
					message.success('Лабораторну карточку оновлено.');
					dispatch(fetchLaboratoryCards()); // оновлення списку карточок
			} else if (resultAction.payload && resultAction.payload.message) {
					//якщо запит виконано з помилкою, показуємо повідомлення від сервера
					const errorMessage = resultAction.payload?.message || 'Не вдалося оновити Лабораторну карточку.';
					message.error(errorMessage);
			} else {
					message.error('Сталася помилка. Лабораторну карточку не оновлено.');
			}	
		} else {
		  await dispatch(createLaboratoryCard(formData));
		  message.success('Лабораторну карточку створено.');
		}

		dispatch(fetchLaboratoryCards());
		handleCloseModal();
	  } catch (error) {
		console.error('Помилка під час збереження Лабораторної карточки:', error);
		message.error('Помилка збереження.');
	  }
	};
  
	const handleDeleteCard = async (record) => {
	  try {
		const resultAction = await dispatch(deleteLaboratoryCard(record.id));
		
		if (deleteLaboratoryCard.fulfilled.match(resultAction)) {
				message.success('Лабораторну карточку успішно видалено!');
		} else if (resultAction.payload && resultAction.payload.message) {
				//якщо запит виконано з помилкою, показуємо повідомлення від сервера
				const errorMessage = resultAction.payload?.message || 'Не вдалося видалити Лабораторну карточку..';
				message.error(errorMessage);
		} else {
				message.error('Сталася помилка. Лабораторну карточку не видалено');
	  }
	  } catch (error) {
		console.error('Помилка під час видалення Лабораторної карточки:', error);
		message.error('Не вдалося видалити Лабораторну карточку.');
	  }
	};

	const handleProductionChange = async (id, isProduction) => {
		try {
		  const resultAction = await dispatch(updateLaboratoryCard({ id, updates: { isProduction } }));

		  // якщо запит виконано успішно
		  if (updateLaboratoryCard.fulfilled.match(resultAction)) {
				message.success('Допуск до виробництва оновлено.');
				dispatch(fetchLaboratoryCards()); // оновлення списку карточок
		  } else if (resultAction.payload && resultAction.payload.message) {
				//якщо запит виконано з помилкою, показуємо повідомлення від сервера
				const errorMessage = resultAction.payload?.message || 'Не вдалося оновити допуск до виробництва.';
				message.error(errorMessage);
		  } else {
			message.error('Сталася невідома помилка.');
		  }

		} catch (error) {
		  console.error('Помилка під час оновлення допуску до виробництва:', error);
		  message.error('Не вдалося оновити допуск до виробництва.');
		}
	  };
  
	return (
	  <div className="container">
		<Title level={2} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
		  Лабораторні карточки
		</Title>
  
		<LaboratoryCardFilterFields filters={filters} onFilterChange={handleFilterChange} />
  
		<Button type="primary" onClick={() => handleOpenModal(null)} style={{ margin: 30, width: '10%' }}>
		  Створити лабораторну карточку
		</Button>
  
		<LaboratoryCardsTable
        laboratoryCards={laboratoryCards}
        loading={loading}
        pagination={pagination}
        handleTableChange={handleTableChange}
        handleOpenModal={handleOpenModal}
        handleDeleteCard={handleDeleteCard}
        handleProductionChange={handleProductionChange}
      />
  
		<Modal
		  title={selectedCard ? 'Редагувати лабораторну карточку' : 'Створити лабораторну карточку'}
		  open={isModalOpen}
		  onCancel={handleCloseModal}
		  footer={null}
		>
		  <LaboratoryCardForm
			key={selectedCard ? selectedCard.id : 'new'}
			initialData={selectedCard}
			onSubmit={handleFormSubmit}
			onCancel={handleCloseModal}
		  />
		</Modal>
	  </div>
	);
  };
  
  export default LaboratoryCardPage;