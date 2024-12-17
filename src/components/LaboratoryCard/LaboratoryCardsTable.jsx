import React from 'react';
import { Modal, Button, Table, Checkbox, message } from 'antd'
import dayjs from 'dayjs';
import { setSort } from '../../slices/laboratoryCardSlice'
import { fetchLaboratoryCards } from '../../asyncThunks/laboratoryCardThunk'
import { useDispatch } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const LaboratoryCardsTable = ({
	laboratoryCards,
	loading,
	pagination,
	handleTableChange,
	handleOpenModal,
	handleDeleteCard,
	handleProductionChange,
  }) => {
	const dispatch = useDispatch();

	const showDeleteConfirm = (record) => {
		Modal.confirm({
		  title: 'Ви впевнені, що хочете видалити цю Лабораторну карточку?',
		  icon: <ExclamationCircleOutlined />,
		  content: `Номер карточки: ${record.labCardNumber}`,
		  okText: 'Так, видалити',
		  okType: 'danger',
		  cancelText: 'Скасувати',
		  onOk() {
			handleDeleteCard(record);
		  },
		  onCancel() {
			console.log('Скасовано користувачем');
		  },
		});
	  };

	const columns = [
	  { title: '№', dataIndex: 'labCardNumber', key: 'labCardNumber', sorter: true },
	  {
		title: 'Дата прибуття',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
		render: (date) => (dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату не визначено'),
		sorter: true,
	  },
	  { title: 'Номер накладної', dataIndex: 'invoiceNumber', key: 'invoiceNumber', sorter: true },
	  { title: 'Вага', dataIndex: 'physicalWeight', key: 'physicalWeight', sorter: true },
	  { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
	  { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
	  { title: 'Сміттева домішка', dataIndex: 'weedImpurity', key: 'weedImpurity', sorter: true },
	  { title: 'Вологість', dataIndex: 'moisture', key: 'moisture', sorter: true },
	  { title: 'Зернова домішка', dataIndex: 'grainImpurity', key: 'grainImpurity', sorter: true },
	  { title: 'Особливі примітки', dataIndex: 'specialNotes', key: 'specialNotes', sorter: true },
	  
	  {
		title: 'Допуск до виробництва',
		dataIndex: 'isProduction',
		key: 'isProduction',
		sorter: true,
		render: (isProduction, record) => (
		  <Checkbox
			checked={isProduction}
			onChange={(e) => handleProductionChange(record.id, e.target.checked)}
		  />
		),
	  },

	  { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName', sorter: true },

	  {
		title: 'Дії',
		key: 'actions',
		render: (_, record) => (
		  !record.isFinalized ? (
			<div>
			  <Button type="link" onClick={() => handleOpenModal(record)}>
					Редагувати
			  </Button>
			  <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
					Видалити
			  </Button>
			</div>
		  ) : (
			<div>Додано в Реєстр</div>
		  )
		),
	  },
	];
  
	return (
	  <Table
		columns={columns}
		dataSource={laboratoryCards}
		rowKey="id"
		pagination={{
		  current: pagination.current,
		  pageSize: pagination.pageSize,
		  total: pagination.total,
		  onChange: handleTableChange,
		}}
		loading={loading}

		onChange={(pagination, filters, sorter) => {
			const sortField = sorter.field; // стовпець для сортування
			const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // напрямок сортування
			dispatch(setSort({ sortField, sortOrder })); // оновлення стану сортування
			dispatch(fetchLaboratoryCards()); // виконання нового запиту
		}}
	  />
	);
  };
  
  export default LaboratoryCardsTable;
  

