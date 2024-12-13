import React from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';

const InputInvoiceItem = ({ invoices, selectedInvoiceId, onSelect }) => {
    const columns = [
        { title: 'Номер накладної', dataIndex: 'invoiceNumber', key: 'invoiceNumber', sorter: true },
		{ 
            title: 'Дата прибуття', 
            dataIndex: 'arrivalDate', 
            key: 'arrivalDate', 
			render: (date) => dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату не визначено'
        },
        { title: 'Транспорт', dataIndex: 'vehicleNumber', key: 'vehicleNumber', sorter: true },
        { title: 'Вага', dataIndex: 'physicalWeight', key: 'physicalWeight', sorter: true},
        { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle', sorter: true },
        { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle', sorter: true },
        { title: 'Створено', dataIndex: 'createdByName', key: 'createdByName' },
    ];

    return (
        <Table
            columns={columns}
            dataSource={invoices}
            rowKey="id"
            rowClassName={(record) => (record.id === selectedInvoiceId ? 'ant-table-row-selected' : '')}
            onRow={(record) => ({
                onClick: () => onSelect(record),
            })}
            pagination={false}
        />
    );
};

export default InputInvoiceItem;

