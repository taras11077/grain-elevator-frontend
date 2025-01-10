import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import React from 'react'

const SupplierTable = ({
	suppliers,
  	loading,
  	pagination,
  	onTableChange,
  	handleOpenModal,
	handleDeleteSupplier,
}) => {

	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цього Постачальника?',
		icon: <ExclamationCircleOutlined />,
		content: ` ${record.title}`,
		okText: 'Так',
		okType: 'danger',
		cancelText: 'Скасувати',
		onOk() {
			handleDeleteSupplier(record);
		},
		onCancel() {
		  console.log('Скасовано користувачем');
		},
	  });
	};

 const columns = [
	  	{ title: 'Постачальник', dataIndex: 'title', key: 'title', sorter: true },
	  	{ title: 'Автор', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
		{
			title: 'Дії',
			key: 'actions',
			render: (_, record) => (
			<div>
				<Button type="link" onClick={() => handleOpenModal(record)}>
					Редагувати
				</Button>
				<Button type="link" danger onClick={() => showDeleteConfirm(record)}>
					Видалити
				</Button>
			</div>
			),
		},
	];
	
	return (
		<Table
			columns={columns}
			dataSource={suppliers}
			rowKey="id"
			loading={loading}
			pagination={{
			current: pagination.current,
			pageSize: pagination.pageSize,
			total: pagination.total,
			}}
			
			onChange={onTableChange}
	  />
	);
   };
   
   export default SupplierTable;