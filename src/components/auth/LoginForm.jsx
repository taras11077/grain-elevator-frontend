import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { login } from '../../api/authApi'

const LoginForm = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try 
	{
			setLoading(true);
			const token = await login(values.email, values.password);
			localStorage.setItem('token', token); // збереження токена
			message.success('Авторизація успішна!');
			onLoginSuccess();
			
    } catch (error) {
     		message.error(
        	error.response?.data?.message || 'Помилка під час авторизації!'
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

      <Button type="primary" htmlType="submit" loading={loading}>
        	Увійти
      </Button>
    </Form>
  );
};

export default LoginForm;
