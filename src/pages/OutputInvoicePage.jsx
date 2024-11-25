import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const OutputInvoicesList = () => {
    const [outputInvoices, setOutputInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/api/output-invoice');
                setOutputInvoices(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке накладных:", error);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <div>
            <h2>Список Видаткових Накладних</h2>
            <ul>
                {outputInvoices.map((invoice) => (
                    <li key={invoice.id}>{invoice.invoiceNumber}</li>
                ))}
            </ul>
        </div>
    );
};

export default OutputInvoicesList;
