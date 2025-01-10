import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const CompletionReportTable = ({
  reports,
  loading,
  pagination,
  onTableChange,
  handleOpenModal,
  handleDeleteReport,
  handleFinancialSettlement,
}) => {
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цей Акт виконаних робіт?',
      icon: <ExclamationCircleOutlined />,
      content: `Номер акта: ${record.reportNumber}`,
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk() {
        handleDeleteReport(record);
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
            dataSource={record.completionReportOperations}
            columns={[
              { title: 'Технологична операція', dataIndex: 'technologicalOperationTitle', key: 'technologicalOperationTitle',},
              { title: 'Кількість доробленої продукції, т', 
					dataIndex: 'amount', 
					key: 'amount', 
					render: (value) => value.toFixed(3)},
              { title: 'Вартість доробки, грн.', 
					dataIndex: 'operationCost', 
					key: 'operationCost', 
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
    { title: '№', dataIndex: 'reportNumber', key: 'reportNumber', sorter: true },
    {
      title: 'Дата складання',
      dataIndex: 'reportDate',
      key: 'reportDate',
	  sorter: (a, b) => dayjs(a.reportDate, 'DD-MM-YYYY').unix() - dayjs(b.reportDate, 'DD-MM-YYYY').unix(),
    },
    { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
    { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
    { title: 'Кількість доробленої продукції, т',
		 dataIndex: 'physicalWeightReport', 
		 key: 'physicalWeightReport', 
		 sorter: true , 
		 render: (value) => value.toFixed(3)},
    { title: 'Отримано кондіційної продукції, т', 
		dataIndex: 'accWeightReport', 
		key: 'accWeightReport', 
		sorter: true , 
		render: (value) => value.toFixed(3)},
    { title: 'Отримано відходів, т', 
		dataIndex: 'wasteReport', 
		key: 'wasteReport', 
		sorter: true,  
		render: (value) => value.toFixed(3)},
    { title: 'Кількість сушки, т*%',
		 dataIndex: 'quantitiesDryingReport', 
		 key: 'quantitiesDryingReport', 
		 sorter: true, 
		 render: (value) => value.toFixed(3)}, // округлення до 3 десяткових знаків
    { title: 'Загальна сума, грн.', 
			dataIndex: 'totalCost', 
			key: 'totalCost', 
			sorter: true , 
			ender: (value) => value.toFixed(2)},
    { title: 'Автор документу', dataIndex: 'createdByName', key: 'createdByName', sorter: true },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) =>
        !record.isFinalized ? (
          <div>
            <Button type="link" onClick={() => handleOpenModal(record)}>
              Редагувати
            </Button>
            <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
              Видалити
            </Button>

			{record.totalCost === 0 || record.totalCost === null ? (
				<Button type="link" onClick={() => handleFinancialSettlement(record)}>
					Сформувати рахунок
				</Button>
				) : null}

          </div>
        ) : (
          <div>Сформований рахунок на оплату</div>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reports.map((report) => ({
			  ...report,
			  reportDate: dayjs(report.reportDate).format('DD-MM-YYYY'), // форматування дати
			}))}
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

export default CompletionReportTable;