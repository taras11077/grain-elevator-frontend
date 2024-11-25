import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { register } from '../../api/authApi';

const { Option } = Select;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await register(values.email, values.password, values.roleId);
      message.success('Реєстрація успішна!');
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Помилка під час реєстрації!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Електронна пошта"
        name="email"
        rules={[
          { required: true, message: 'Будь ласка, введіть електронну пошту!' },
          { type: 'email', message: 'Введіть коректну електронну пошту!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[
          { required: true, message: 'Будь ласка, введіть пароль!' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Роль"
        name="roleId"
        rules={[{ required: true, message: 'Будь ласка, виберіть роль!' }]}
      >
        <Select placeholder="Оберіть роль">
          <Option value={1}>Адміністратор</Option>
          <Option value={2}>Користувач</Option>
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Зареєструватися
      </Button>
    </Form>
  );
};

export default RegisterForm;
