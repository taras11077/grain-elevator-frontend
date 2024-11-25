import React from 'react';
import { Table } from 'antd';

const InputInvoiceItem = ({ invoices, selectedInvoiceId, onSelect }) => {
    const columns = [
        { title: 'Номер накладної', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
        { title: 'Дата прибуття', dataIndex: 'arrivalDate', key: 'arrivalDate', render: (date) => new Date(date).toLocaleDateString() },
        { title: 'Транспорт', dataIndex: 'vehicleNumber', key: 'vehicleNumber' },
        { title: 'Вага', dataIndex: 'physicalWeight', key: 'physicalWeight' },
        { title: 'Продукція', dataIndex: 'productTitle', key: 'productTitle' },
        { title: 'Постачальник', dataIndex: 'supplierTitle', key: 'supplierTitle' },
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



// const InputInvoiceItem = ({ invoice, isSelected, onSelect }) => {
//     return (
//         <tr
//             onClick={() => onSelect(invoice)}
//             style={{
//                 backgroundColor: isSelected ? 'lightsteelblue' : 'white',
//                 cursor: 'pointer',
//             }}
//         >
//             <td>{invoice.invoiceNumber}</td>
//             <td>{new Date(invoice.arrivalDate).toLocaleDateString()}</td>
//             <td>{invoice.vehicleNumber}</td>
//             <td>{invoice.physicalWeight}</td>
// 			<td>{invoice.productTitle}</td>
// 			<td>{invoice.supplierTitle}</td>
// 			<td>{invoice.createdByName}</td>
//         </tr>
//     );
// };

// export default InputInvoiceItem;
