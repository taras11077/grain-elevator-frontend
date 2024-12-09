// import React, { useState } from 'react';
// import { Form, Input, Button, Select, message } from 'antd';
// import { register } from '../../api/authApi';

// const { Option } = Select;

// const RegisterForm = () => {
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     try {
//       setLoading(true);
//       await register(values.email, values.password, values.roleId);
//       message.success('Реєстрація успішна!');
//     } catch (error) {
//       message.error(
//         error.response?.data?.message || 'Помилка під час реєстрації!'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onFinish={onFinish} layout="vertical">
//       <Form.Item
//         label="Електронна пошта"
//         name="email"
//         rules={[
//           { required: true, message: 'Будь ласка, введіть електронну пошту!' },
//           { type: 'email', message: 'Введіть коректну електронну пошту!' },
//         ]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="Пароль"
//         name="password"
//         rules={[
//           { required: true, message: 'Будь ласка, введіть пароль!' },
//         ]}
//       >
//         <Input.Password />
//       </Form.Item>

//       <Form.Item
//         label="Роль"
//         name="roleId"
//         rules={[{ required: true, message: 'Будь ласка, виберіть роль!' }]}
//       >
//         <Select placeholder="Оберіть роль">
//           <Option value={1}>Адміністратор</Option>
//           <Option value={2}>Користувач</Option>
//         </Select>
//       </Form.Item>

//       <Button type="primary" htmlType="submit" loading={loading}>
//         Зареєструватися
//       </Button>
//     </Form>
//   );
// };

// export default RegisterForm;

import { Button, Form, Input } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { registration } from '../../asyncThunks/authThunk'

const RegistrationForm = ({closeModal}) => {
	const dispatch = useDispatch();

	const onFinish = async (values) => {	
		dispatch(registration(values));
		closeModal();
	  };

	return (
		<div className='modal-container'>
			<Form name="registration" onFinish={onFinish} labelAlign="left" layout="vertical" >

				<Form.Item name="name" label="Name:"
					rules={[
					{
						required: true,
						whitespace: true,
						message: 'Please enter your name!',
					},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item name="email" label="Email:"
					rules={[
					{
						required: true,
						whitespace: true,
						type: 'email',
						message: 'Please enter a valid e-mail address!',
					},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item name="password" label="Password:"
					rules={[
					{
						required: true,
						whitespace: true,
						message: 'Please enter your password!',
					},
					{
						min: 8,
						message: 'Password must contain a minimum of 8 characters!',
					},
					]}
					hasFeedback
				>
					<Input.Password />
				</Form.Item>

				<Form.Item name="confirm" label="Confirm password:" dependencies={['password']} hasFeedback
					rules={[
					{
						required: true,
						whitespace: true,
						message: 'Please confirm password!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(new Error("The passwords don't match!"));
						},
					}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item>
					<Button htmlType="submit">
						Sign up
					</Button>
				</Form.Item>
		</Form>

		<NavLink id='login-registration-link' className='nav-link' to="/login">I am already registered</NavLink>
	</div>
	)
}

export default RegistrationForm;
