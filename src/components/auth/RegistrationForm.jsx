import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { registration } from '../../asyncThunks/authThunk';
import { fetchRoles } from '../../asyncThunks/roleThunk'; // Асинхронный экшен для получения ролей
import { useNavigate } from 'react-router-dom'

const { Option } = Select;

const RegistrationForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth); // Состояние авторизации
  const { roles, rolesLoading } = useSelector((state) => state.roles); // Состояние ролей

  useEffect(() => {
    dispatch(fetchRoles()); // Загружаем роли при загрузке формы
  }, [dispatch]);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await dispatch(registration(values)); // Отправляем данные регистрации
	navigate('/home');
	if (registration.fulfilled.match(result)) {
      message.success('Реєстрацію успішно завершено!');
      closeModal();
    } else {
      message.error(result.payload || 'Реєстрація не вдалася.');
    }
  };

  return (
    <div className="modal-container">
      <Form name="registration" onFinish={onFinish} labelAlign="left" layout="vertical">
        {/* Им'я */}
        <Form.Item
          name="firstName"
          label="Ім'я:"
          rules={[
            { required: true, whitespace: true, message: 'Будь ласка, введіть Ім я!' },
          ]}
        >
          <Input />
        </Form.Item>

 		{/* Прізвище */}
		<Form.Item
          name="lastName"
          label="Прізвище:"
          rules={[
            { required: true, whitespace: true, message: 'Будь ласка, введіть Прізвище!' },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email:"
          rules={[
            { required: true, whitespace: true, type: 'email', message: 'Будь ласка, введіть дійсну адресу електронної пошти!' },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Пароль */}
        <Form.Item
          name="password"
          label="Пароль:"
          rules={[
            { required: true, whitespace: true, message: 'Будь ласка, введіть свій пароль!' },
            { min: 8, message: 'Пароль повинен містити мінімум 8 символів!' },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        {/* підтверрження пароля */}
        <Form.Item
          name="confirm"
          label="Підтвердіть пароль:"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, whitespace: true, message: 'Будь ласка, підтвердіть пароль!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Паролі не співпадають!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Выбор роли */}
        <Form.Item
          name="roleId"
          label="Роль:"
          rules={[
            { required: true, message: 'Будь ласка, оберіть роль!' },
          ]}
        >
          <Select placeholder="Оберіть роль" loading={rolesLoading}>
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary" loading={loading}>
           Створити
          </Button>
        </Form.Item>
      </Form>

      <NavLink id="login-registration-link" className="nav-link" to="/login">
        I am already registered
      </NavLink>
    </div>
  );
};

export default RegistrationForm;