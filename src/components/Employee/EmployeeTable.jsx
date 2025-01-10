import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'


const EmployeeTable = ({
  employees,
  loading,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
}) => {
	const showDeleteConfirm = (record) => {
	  Modal.confirm({
		title: 'Ви впевнені, що хочете видалити дані цього Співробітника?',
		icon: <ExclamationCircleOutlined />,
		content: `${record.firstName} ${record.lastName}`,
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
	{ title: 'Id', dataIndex: 'id', key: 'id', sorter: true },
    { title: 'Їм`я', dataIndex: 'firstName', key: 'firstName', sorter: true },
    { title: 'Призвище', dataIndex: 'lastName', key: 'lastName', sorter: true },
	{ title: 'Роль', dataIndex: 'roleTitle', key: 'roleTitle', sorter: true },
	{ title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
    { title: 'Номер телефону', dataIndex: 'phone', key: 'phone', sorter: true },
	{
		title: 'Дата народження',
		dataIndex: 'birthDate',
		key: 'birthDate',
		render: (date) => (dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату народження не визначено'),
		sorter: true,
	  },

	{ title: 'Пол', dataIndex: 'gender', key: 'gender', sorter: true }, 
    { title: 'Місто', dataIndex: 'city', key: 'city', sorter: true }, 
    { title: 'Країна', dataIndex: 'country', key: 'country', sorter: true },
	{
		title: 'Остання активність',
		dataIndex: 'lastSeenOnline',
		key: 'lastSeenOnline',
		render: (date) => (dayjs(date).isValid() ? dayjs(date).format('DD-MM-YYYY') : 'дату останньої активності не визначено'),
		sorter: true,
	  },
	  { title: 'HR', dataIndex: 'createdByName', key: 'createdByName', sorter: true },

    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) =>
          <div>
            <Button type="link" onClick={() => onEdit(record)}>
              Редагувати
            </Button>
			<Button type="link" danger onClick={() => showDeleteConfirm(record)}>
              Видалити
            </Button>
          </div>
    },
  ];

  return (
    <Table
      rowSelection={null }
      dataSource={employees.map((employee) => ({
        ...employee,
        birthDate: dayjs(employee.birthDate).format('DD-MM-YYYY'), // форматування дати
		lastSeenOnline: dayjs(employee.lastSeenOnline).format('DD-MM-YYYY'),
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

export default EmployeeTable;

