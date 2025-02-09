import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteEmployee,
	fetchEmployees,
	updateEmployee
} from '../asyncThunks/employeeThunk'
import RegistrationForm from '../components/Auth/RegistrationForm'
import EmployeeFilterFields from '../components/Employee/EmployeeFilterFields'
import EmployeeForm from '../components/Employee/EmployeeForm'
import EmployeeTable from '../components/Employee/EmployeeTable'
import {
	setFilters,
	setPagination,
	setSelectedEmployee,
	setSort,
	toggleModal,
} from '../slices/employeeSlice'

const EmployeePage = () => {
  const { Title } = Typography;
  const dispatch = useDispatch();

  const {
    employees,
    loading,
    pagination,
    filters,
    isModalOpen,
    selectedEmployee,
  } = useSelector((state) => state.employees);

  const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [filters, pagination.current, pagination.pageSize]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleTableChange = (pagination, _, sorter) => {
    const sortField = sorter?.field || null;
    const sortOrder = sorter?.order === 'ascend' ? 'asc' : 'desc';
    dispatch(setSort({ sortField, sortOrder }));
    dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
    dispatch(fetchEmployees());
  };

  const handleOpenRegistrationModal = () => {
    setRegistrationModalOpen(true);
  };

  
  const handleRegistrationSuccess = () => {
	dispatch(fetchEmployees());
  }

  const handleCloseRegistrationModal = () => {
    setRegistrationModalOpen(false);
  };

  const handleOpenEditModal = (employee = null) => {
    dispatch(setSelectedEmployee(employee));
    dispatch(toggleModal(true));
  };

  const handleCloseEditModal = () => {
    dispatch(toggleModal(false));
    dispatch(setSelectedEmployee(null));
  };

  
  const handleFormSubmit = async (formData) => {
    try {
        const resultAction = await dispatch(updateEmployee({ id: selectedEmployee.id, updates: formData }));
        if (updateEmployee.fulfilled.match(resultAction)) {
          message.success('Дані співробітника оновлено.');
          dispatch(fetchEmployees());
        } else {
          const errorMessage = resultAction.payload?.message || 'Не вдалося оновити дані співробітника.';
          message.error(errorMessage);
        }
      handleCloseEditModal();
    } catch (error) {
      console.error('Помилка збереження:', error);
      message.error('Помилка збереження.');
    }
  };

  const handleDeleteEmployee = async (record) => {
    try {
      dispatch(deleteEmployee(record.id));
      message.success('Дані співробітника успішно видалено!');
      dispatch(fetchEmployees());
    } catch (error) {
      console.error('Помилка видалення:', error);
      message.error('Не вдалося видалити дані співробітника.');
    }
  };

  return (
    <div className="container">
       <Title level={1} className="page-title">
        Список співробітників
      </Title>
	  <Title level={4} className="page-subtitle">
        із визначенням рівня допуску до інформації.
      </Title>

      <EmployeeFilterFields filters={filters} onFilterChange={handleFilterChange} />

      <Button
         className="action-button"
        onClick={handleOpenRegistrationModal}
      >
        Додати Співробітника
      </Button>

      <EmployeeTable
        employees={employees}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteEmployee}
      />

      <Modal
        title={'Редагувати дані співробітника'}
        open={isModalOpen}
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EmployeeForm
			key={selectedEmployee ? selectedEmployee.id : 'new'}
			initialData={selectedEmployee}
			onSubmit={handleFormSubmit}
			onCancel={handleCloseEditModal}
		/>
      </Modal>

      <Modal
        title="Реєстрація нового співробітника"
        open={isRegistrationModalOpen}
        onCancel={handleCloseRegistrationModal}
        footer={null}
      >
        <RegistrationForm
			closeModal={handleCloseRegistrationModal}
			onRegistrationSuccess={handleRegistrationSuccess}
		 />
      </Modal>
    </div>
  );
};

export default EmployeePage;
