import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Table } from 'antd'
import React from 'react'

const { Panel } = Collapse;

const WarehouseTable = ({
  warehouseUnits,
  loading,
  pagination,
  onTableChange,
  onDelete,
  onNavigateToOutputInvoice,
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
    });
  };

  const expandedRowRender = (record) => (
    <Collapse>
      <Panel header="Категорії продукції" key="1">
        <Table
          dataSource={record.productCategories}
          columns={[
            { title: 'Категорія', dataIndex: 'title', key: 'title' },
            { title: 'Кількість', dataIndex: 'value', key: 'value' },
            {
              key: 'actions',
              render: (_, productCategory) => (
                <Button
                  type="link"
				  onClick={() =>
					onNavigateToOutputInvoice(record, productCategory, false, true) // `isEditing=false` та `isFromWarehouse=true`
				  }
                >
                  Відвантажити
                </Button>
              ),
            },
          ]}
          rowKey="id"
          pagination={false}
        />
      </Panel>
    </Collapse>
  );

  const columns = [
    { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
    { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
    { title: 'Автор', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
    {
      key: 'actions',
      render: (_, record) => (
        <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
          Видалити
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowSelection={null}
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
      expandable={{ expandedRowRender }}
    />
  );
};

export default WarehouseTable;
