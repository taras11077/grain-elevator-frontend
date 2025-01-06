import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import React from 'react'

const TechnologicalOperationTable = ({
	technologicalOperations,
  	loading,
  	pagination,
  	onTableChange,
  	handleOpenModal,
	handleDeleteTechnologicalOperation,
  	isForCompletionReport = false,
	selectedRowKeys = [],
	 onRowSelect = () => {},
}) => {

	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цю Технологичну операцію?',
		icon: <ExclamationCircleOutlined />,
		content: ` ${record.title}`,
		okText: 'Так',
		okType: 'danger',
		cancelText: 'Скасувати',
		onOk() {
			handleDeleteTechnologicalOperation(record);
		},
		onCancel() {
		  console.log('Скасовано користувачем');
		},
	  });
	};

 const columns = [
	  { title: 'Назва операції', dataIndex: 'title', key: 'title', sorter: true },
	  { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
	  ...(isForCompletionReport
		? [] // Не додаємо стовпець "Дії" у контексті вибору
		: [
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
		  ]),
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
			dataSource={technologicalOperations}
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
   
   export default TechnologicalOperationTable;