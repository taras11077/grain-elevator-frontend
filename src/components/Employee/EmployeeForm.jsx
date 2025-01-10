import { Button, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;

const EmployeeForm = ({ initialData = {}, onSubmit, onCancel }) => {

	const dispatch = useDispatch();
	const { roles, loading: rolesLoading } = useSelector((state) => state.roles);

	const preparedInitialData = {
	  ...initialData,
	  birthDate: initialData?.birthDate 
		? dayjs(initialData.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD') 
		: '',
	  lastSeenOnline: initialData?.lastSeenOnline 
		? dayjs(initialData.lastSeenOnline, 'DD-MM-YYYY').format('YYYY-MM-DD') 
		: '',
	};
  
	const EmployeeSchema = Yup.object().shape({
	  firstName: Yup.string().notRequired(),
	  lastName: Yup.string().notRequired(),
	  roleTitle: Yup.string().notRequired(),
	  email: Yup.string().email('Некоректний Email').notRequired(),
	  phone: Yup.string().notRequired(),
	  birthDate: Yup.date().notRequired()
			.nullable()
			.transform((value, originalValue) =>
				originalValue === "" ? null : value
	  )
	  .typeError("Введіть дійсну дату"),
	  gender: Yup.string().notRequired(),
	  city: Yup.string().notRequired(),
	  country: Yup.string().notRequired(),
	  passwordHash: Yup.string().when('confirmPassword', {
		is: (value) => !!value,
		then: Yup.string().required('Пароль обов’язковий, якщо вводиться підтвердження').notRequired(),
	  }),
	  confirmPassword: Yup.string().oneOf(
		[Yup.ref('passwordHash'), null],
		'Паролі повинні співпадати'
	  ),
	});
  
	return (
	  <Formik
		initialValues={{
		  firstName: preparedInitialData?.firstName || '',
		  lastName: preparedInitialData?.lastName || '',
		  roleTitle: preparedInitialData?.roleTitle || '',
		  email: preparedInitialData?.email || '',
		  phone: preparedInitialData?.phone || '',
		  birthDate: preparedInitialData?.birthDate || '',
		  gender: preparedInitialData?.gender || '',
		  city: preparedInitialData?.city || '',
		  country: preparedInitialData?.country || '',
		  passwordHash: '',
		  confirmPassword: '',
		}}
		validationSchema={EmployeeSchema}
		onSubmit={onSubmit}
	  >
		{({ errors, touched, values, setFieldValue }) => (
		  <Form>
			<div>
			  <label>Їм`я:</label>
			  <Field name="firstName" as={Input} />
			  {errors.firstName && touched.firstName && <div>{errors.firstName}</div>}
			</div>
			<div>
			  <label>Призвище:</label>
			  <Field name="lastName" as={Input} />
			  {errors.lastName && touched.lastName && <div>{errors.lastName}</div>}
			</div>
			<div>
			  <label>Роль:</label>
			  <Select
					value={values.roleTitle}
					onChange={(value) => setFieldValue('roleTitle', value)}
					style={{ width: '100%' }} 
					>
					{roles.map((role) => (
						<Option key={role.id} value={role.title}>
							{role.title}
						</Option>
					))}
				</Select>

			  {errors.roleTitle && touched.roleTitle && <div>{errors.roleTitle}</div>}
			</div>
			<div>
			  <label>Email:</label>
			  <Field name="email" as={Input} />
			  {errors.email && touched.email && <div>{errors.email}</div>}
			</div>
			<div>
			  <label>Номер телефону:</label>
			  <Field name="phone" as={Input} />
			  {errors.phone && touched.phone && <div>{errors.phone}</div>}
			</div>
			<div>
			  <label>Дата народження:</label>
			  <Field 
				name="birthDate" 
				type="date"
				as={Input}
				value={values.birthDate ? dayjs(values.birthDate).format('YYYY-MM-DD') : ''}
			  />
			  {errors.birthDate && touched.birthDate && <div>{errors.birthDate}</div>}
			</div>
			<div>
			  <label>Пол:</label>
			  <Field name="gender" as={Input} />
			  {errors.gender && touched.gender && <div>{errors.gender}</div>}
			</div>
			<div>
			  <label>Місто:</label>
			  <Field name="city" as={Input} />
			  {errors.city && touched.city && <div>{errors.city}</div>}
			</div>
			<div>
			  <label>Країна:</label>
			  <Field name="country" as={Input} />
			  {errors.country && touched.country && <div>{errors.country}</div>}
			</div>
			<div>
			  <label>Пароль:</label>
			  <Field name="passwordHash" type="password" as={Input} />
			  {errors.passwordHash && touched.passwordHash && <div>{errors.passwordHash}</div>}
			</div>
			<div>
			  <label>Підтвердіть пароль:</label>
			  <Field name="confirmPassword" type="password" as={Input} />
			  {errors.confirmPassword && touched.confirmPassword && <div>{errors.confirmPassword}</div>}
			</div>
			<div style={{ marginTop: '16px' }}>
			  <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
				Зберегти
			  </Button>
			  <Button onClick={onCancel}>Скасувати</Button>
			</div>
		  </Form>
		)}
	  </Formik>
	);
  };
  
  export default EmployeeForm;
  