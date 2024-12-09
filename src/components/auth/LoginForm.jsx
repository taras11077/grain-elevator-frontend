// import { Button, Form, Input, message } from 'antd'
// import React, { useState } from 'react'
// import { login } from '../../api/authApi'

// const LoginForm = ({ onLoginSuccess }) => {
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     try 
// 	{
// 			setLoading(true);
// 			const token = await login(values.email, values.password);
// 			localStorage.setItem('token', token); // збереження токена
// 			message.success('Авторизація успішна!');
// 			onLoginSuccess();
			
//     } catch (error) {
//      		message.error(
//         	error.response?.data?.message || 'Помилка під час авторизації!'
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

//       <Button type="primary" htmlType="submit" loading={loading}>
//         	Увійти
//       </Button>
//     </Form>
//   );
// };

// export default LoginForm;

import { Button, Form, Input, Modal } from 'antd'
import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../asyncThunks/authThunk'

const LoginForm = ({closeModal}) => {

	const {loading, error} = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onFinish = async (values) => {
		dispatch(login(values));
		
		if(error){
			Modal.error({
				title: 'Error:',
				content: `${error}`,
				centered: true
			  });
		}

		closeModal();
		navigate('/home');
	  };

	return (
		<div className='modal-container'>
			<Form			
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{}}
				onFinish={onFinish}
				autoComplete="off"
				>
				<Form.Item
					label="Email"
					name="email"
					rules={[
					{
						required: true,
						message: "Please input your email!",
					},
					]}
				>
					<Input />
				</Form.Item>
		
				<Form.Item
					label="Password"
					name="password"
					rules={[
					{
						required: true,
						message: "Please input your password!",
					},
					]}
				>
					<Input.Password />
				</Form.Item>
		
				<Form.Item
					wrapperCol={{
					offset: 8,
					span: 16,
					}}
				>

				{loading ? 'Loading...' : <Button htmlType="submit">
												Log in
										  </Button>}			
				</Form.Item>	
			</Form>

			
	  </div>
	);
}

export default LoginForm;
