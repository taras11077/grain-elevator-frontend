import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'


const OutputInvoiceTable = ({
  outputInvoices,
  loading,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
}) => {
	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цю Видаткову накладну?',
		icon: <ExclamationCircleOutlined />,
		content: `Номер накладної: ${record.invoiceNumber}`,
		okText: 'Так',
		okType: 'danger',
		cancelText: 'Скасувати',
		onOk() {
			onDelete(record);
		},
		onCancel() {
		  console.log('Скасовано користувачем');
		},
	  });
	};

	const columns = [
    { title: '№', dataIndex: 'invoiceNumber', key: 'invoiceNumber', sorter: true },
    {
      title: 'Дата відвантаження',
      dataIndex: 'shipmentDate',
      key: 'shipmentDate',
      render: (date) => (dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату не визначено'),
	  sorter: true,
    },
    { title: 'Номер транспортного засобу', dataIndex: 'vehicleNumber', key: 'vehicleNumber', sorter: true },
	{ title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
    { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
	{ title: 'Категорія продукції', dataIndex: 'productCategory', key: 'productCategory', sorter: true }, 
    { title: 'Вага', dataIndex: 'productWeight', key: 'productWeight', sorter: true }, 
    { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) =>
        !record.isFinalized ? (
          <div>
            <Button type="link" onClick={() => onEdit(record)}>
              Редагувати
            </Button>
			<Button type="link" danger onClick={() => showDeleteConfirm(record)}>
              Видалити
            </Button>
          </div>
        ) : (
          <div>Створено Видаткову накладну</div>
        ),
    },
  ];

  return (
    <Table
      rowSelection={null }
      dataSource={outputInvoices.map((invoice) => ({
        ...invoice,
        arrivalDate: dayjs(invoice.arrivalDate).format('DD-MM-YYYY'), // форматування дати
      }))}
      columns={columns}
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

export default OutputInvoiceTable;

