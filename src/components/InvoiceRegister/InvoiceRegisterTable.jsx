import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
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
					<div>Обчислено в Акті виконаних робіт</div>
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
	  />
	);
  };
  
  export default InvoiceRegisterTable;
  

