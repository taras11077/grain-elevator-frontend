import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Table } from 'antd'
import React from 'react'

const PriceListTable = ({
  priceLists,
  loading,
  pagination,
  onTableChange,
  handleOpenModal,
  handleDeletePriceList,
  isForCompletionReport = false, // Прапорець для визначення контексту
  onRowSelect,
  selectedRowKeys = [], // Список ключів вибраних рядків
}) => {

	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цей Прайс-лист?',
		icon: <ExclamationCircleOutlined />,
		content: `${record.productTitle}`,
		okText: 'Так',
		okType: 'danger',
		cancelText: 'Скасувати',
		onOk() {
			handleDeletePriceList(record);
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
			label: 'Технологічні операції',
			children: (
			  <Table
				dataSource={record.priceListItems}
				columns={[
				  { title: 'Технологична операція', dataIndex: 'technologicalOperationTitle', key: 'technologicalOperationTitle',},
				  { title: 'Ціна, грн/т.', 
						dataIndex: 'operationPrice', 
						key: 'operationPrice', 
						render: (value) => value.toFixed(2)},
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
	  { title: 'Назва', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
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
              type: 'radio', // Вибір одного рядка
              selectedRowKeys,
              onChange: (selectedKeys) => {
                if (onRowSelect) {
                  onRowSelect(selectedKeys); // Передаємо вибір далі
                }
              },
            }
          : null
      }
      dataSource={priceLists}
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

export default PriceListTable;

