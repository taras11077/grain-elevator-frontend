import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const WarehouseTable = ({
 warehouseUnits,
  loading,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
}) => {
	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цей Складський юніт?',
		icon: <ExclamationCircleOutlined />,
		content: `Постачальник: ${record.supplierTitle} Продукція: ${record.productTitle}`,
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
	{ title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
	{ title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
	{ title: 'Категорія продукції', dataIndex: 'productCategory', key: 'productCategory', sorter: true }, 
	{ title: 'Вага', dataIndex: 'productWeight', key: 'productWeight', sorter: true }, 
	{ title: 'Автор', dataIndex: 'modifiedById', key: 'modifiedById', sorter: true },
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
      dataSource={warehouseUnits}
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

export default WarehouseTable;

