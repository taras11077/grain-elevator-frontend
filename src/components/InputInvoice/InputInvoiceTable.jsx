import React from 'react';
import { Button, Table } from 'antd';
import dayjs from 'dayjs';

const InputInvoiceTable = ({ invoices, loading, pagination, onTableChange, onEdit, onDelete }) => {
	const columns = [
	  { title: '№', dataIndex: 'invoiceNumber', key: 'invoiceNumber', sorter: true },
	  {
		title: 'Дата прибуття',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
		sorter: (a, b) => dayjs(a.arrivalDate, 'DD-MM-YYYY').unix() - dayjs(b.arrivalDate, 'DD-MM-YYYY').unix(),
	  },
	  { title: 'Номер транспортного засобу', dataIndex: 'vehicleNumber', key: 'vehicleNumber', sorter: true },
	  { title: 'Фізична вага', dataIndex: 'physicalWeight', key: 'physicalWeight', sorter: true },
	  { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
	  { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
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
			  <Button type="link" danger onClick={() => onDelete(record)}>
				Видалити
			  </Button>
			</div>
		  ) : (
			<div>Створено лабораторну карточку</div>
		  ),
	  },
	];
  
	const formattedInvoices = invoices.map((invoice) => ({
	  ...invoice,
	  arrivalDate: dayjs(invoice.arrivalDate).format('DD-MM-YYYY'),
	}));
  
	return (
	  <Table
		dataSource={formattedInvoices}
		columns={columns}
		rowKey="id"
		pagination={{
		  current: pagination.current,
		  pageSize: pagination.pageSize,
		  total: pagination.total,
		}}
		loading={loading}
		onChange={onTableChange}
	  />
	);
  };
  
  export default InputInvoiceTable;

