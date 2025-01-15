import { Button, Form, Input, Modal } from 'antd'
import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../asyncThunks/authThunk'
import './Login.css';

const LoginForm = ({closeModal}) => {
	const {loading, error} = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onFinish = async (values) => {
		dispatch(login(values));
		// if(error){
		// 	Modal.error({
		// 		title: 'Error:',
		// 		content: `${error}`,
		// 		centered: true
		// 	  });
		// }
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
						message: "Будь ласка, введіть свій email!",
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
						message: "Будь ласка, введіть свій пароль!",
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
