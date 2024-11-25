import React from 'react';

const OutputInvoiceItem = ({ invoice, isSelected, onSelect }) => {
    return (
        <tr
            onClick={() => onSelect(invoice)}
            style={{
                backgroundColor: isSelected ? '#f0f8ff' : 'white',
                cursor: 'pointer',
            }}
        >
            <td>{invoice.invoiceNumber}</td>
            <td>{new Date(invoice.arrivalDate).toLocaleDateString()}</td>
            <td>{invoice.vehicleNumber}</td>
            <td>{invoice.physicalWeight}</td>
        </tr>
    );
};

export default OutputInvoiceItem;
