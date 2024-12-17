import React from 'react';
import dayjs from 'dayjs';
import { Modal, Button, Checkbox, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux'

const InputInvoiceTable = ({
  invoices,
  loading,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
  isForLabCard = false, // Прапорець для визначення контексту
  onRowSelect,
  selectedRowKeys = [], // Список ключів вибраних рядків
}) => {

	const dispatch = useDispatch();

	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити цю Прибуткову накладну?',
		icon: <ExclamationCircleOutlined />,
		content: `Номер накладної: ${record.invoiceNumber}`,
		okText: 'Так, видалити',
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



  // Колонки для стандартного сценарію
  const standardColumns = [
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
			<Button type="link" danger onClick={() => showDeleteConfirm(record)}>
              Видалити
            </Button>
          </div>
        ) : (
          <div>Створено лабораторну карточку</div>
        ),
    },
  ];

  // Колонки для вибору накладної (для лабораторної карти)
  const labCardColumns = [
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
  ];

  // Вибираємо потрібний набір колонок залежно від контексту
  const columns = isForLabCard ? labCardColumns : standardColumns;

  // Фільтруємо фіналізовані накладні, якщо це режим для лабораторної карти
  const filteredInvoices = isForLabCard
    ? invoices.filter((invoice) => !invoice.isFinalized) // Виключаємо фіналізовані
    : invoices;

  return (
    <Table
      rowSelection={
        isForLabCard
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
      dataSource={filteredInvoices.map((invoice) => ({
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

export default InputInvoiceTable;

