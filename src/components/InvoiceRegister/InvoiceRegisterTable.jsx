import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const InvoiceRegisterTable = ({
	invoiceRegisters,
	loading,
	pagination,
	onTableChange,
	handleOpenModal,
	handleDeleteRegister,
	isForCompletionReport = false,
	selectedRowKeys = [],
	onRowSelect = () => {},
  }) => {

	const showDeleteConfirm = (record) => {
		Modal.confirm({
		  title: 'Ви впевнені, що хочете видалити цей Реєстр?',
		  icon: <ExclamationCircleOutlined />,
		  content: `Номер реєстру: ${record.registerNumber}`,
		  okText: 'Так',
		  okType: 'danger',
		  cancelText: 'Скасувати',
		  onOk() {
			handleDeleteRegister(record);
		  },
		  onCancel() {
			console.log('Скасовано користувачем');
		  },
		});
	  };

	const expandedRowRender = (record) => {
	const items = [
		{
		key: '1',
		label: 'Виробничі партії',
		children: (
			<Table
			dataSource={record.productionBatches}
			columns={[
				{ title: '№ накладної', 
					dataIndex: 'invoiceNumber', 
					key: 'invoiceNumber'},
				{ title: '№ лаб.картки', 
					dataIndex: 'labCardNumber', 
					key: 'invoiceNumber'},
				{ title: 'Фізична вага, кг', 
					dataIndex: 'physicalWeight', 
					key: 'physicalWeight', 
					render: (value) => value.toFixed(0)},
				{ title: 'Сміттєва домішка, %', 
					dataIndex: 'weedImpurity', 
					key: 'weedImpurity', 
					render: (value) => value.toFixed(1)},
				{ title: 'Базова сміттєва домішка, %', 
					dataIndex: 'weedImpurityBase', 
					key: 'weedImpurity', 
					render: (value) => value.toFixed(1)},
				{ title: 'Відходи, кг', 
					dataIndex: 'waste', 
					key: 'waste', 
					render: (value) => value.toFixed(0)},
				{ title: 'Вологість, %', 
					dataIndex: 'moisture', 
					key: 'moisture', 
					render: (value) => value.toFixed(1)},
				{ title: 'Базова вологість, %', 
					dataIndex: 'moistureBase', 
					key: 'moistureBase', 
					render: (value) => value.toFixed(1)},
				{ title: 'Усушка, кг.', 
					dataIndex: 'shrinkage', 
					key: 'shrinkage', 
					render: (value) => value.toFixed(0)},
				{ title: 'Кількість сушки, т*%', 
					dataIndex: 'quantitiesDrying', 
					key: 'quantitiesDrying', 
					render: (value) => value.toFixed(3)},
				{ title: 'Кондиційна продукція, кг.', 
					dataIndex: 'accountWeight', 
					key: 'accountWeight', 
					render: (value) => value.toFixed(0)},
			]}
			rowKey="id"
			pagination={false}
			/>
		),
		},
	];

	return <Collapse items={items} />;
	};

	const columns = [
	  { title: '№', dataIndex: 'registerNumber', key: 'registerNumber', sorter: true },
	  {
		title: 'Дата прибуття',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
		render: (date) => (dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату не визначено'),
		sorter: true,
	  },
	  { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
	  { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
	  { title: 'Физична Вага', dataIndex: 'physicalWeightReg', key: 'physicalWeighReg', sorter: true },
	  { title: 'Усушка', dataIndex: 'shrinkageReg', key: 'shrinkageReg', sorter: true },
	  { title: 'Відходи', dataIndex: 'wasteReg', key: 'wasteReg', sorter: true },
	  { title: 'Залікова вага', dataIndex: 'accWeightReg', key: 'accWeightReg', sorter: true },
	  { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
	  
	  {
		title: 'Дії',
		key: 'actions',
		render: (_, record) => (
			isForCompletionReport ? null : (
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
					<div>Включений в Акт виконаних робіт</div>
				)
			)
		),
	  },
	];
  
	return (
	  <Table
		rowSelection={
			isForCompletionReport
			? {
				type: 'checkbox',
				selectedRowKeys,
				onChange: onRowSelect,
				}
			: null
		}
			columns={columns}
			dataSource={invoiceRegisters}
			rowKey="id"
			loading={loading}
			pagination={{
			current: pagination.current,
			pageSize: pagination.pageSize,
			total: pagination.total,
			}}
			onChange={onTableChange}
			expandable={{ expandedRowRender }}
	  />
	);
  };
  
  export default InvoiceRegisterTable;