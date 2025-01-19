import { Button, Input } from 'antd'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const ProductSchema = Yup.object().shape({
    title: Yup.string().required('Обов’язкове поле'),
});

const ProductForm = ({ initialData, onSubmit, onCancel }) => {

	return (
		<Formik
			initialValues={{
				title: initialData?.title || '',
			}}
			validationSchema={ProductSchema}
			onSubmit={onSubmit}
		>
			{({ errors, touched, values }) => (
				<Form>
					<div>
						<label>Продукція:</label>
						<Field name="title" as={Input} />
						{errors.title && touched.title && <div>{errors.title}</div>}
					</div>
				
					<div style={{ marginTop: '16px' }}>
						<Button className="action-button" htmlType="submit" style={{ marginRight: '8px' }}>
							Зберегти
						</Button>
						<Button onClick={onCancel}>Скасувати</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default ProductForm;