import { Button, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers } from '../../asyncThunks/supplierThunk';
import { fetchProducts } from '../../asyncThunks/productThunk';


const { Option } = Select;

const getValidationSchema = (isEditing) =>
    Yup.object().shape({
      registerNumber: Yup.string().required('Обов’язкове поле'),
      arrivalDate: isEditing ? Yup.mixed().notRequired() : Yup.date().required('Обов’язкове поле'),
      supplierTitle: isEditing ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
      productTitle: isEditing ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
      weedImpurityBase: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
      moistureBase: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
    });

const InvoiceRegisterForm = ({ initialData, onSubmit, onCancel , isEditing }) => {
	const dispatch = useDispatch();

  	const { suppliers, loading: suppliersLoading } = useSelector((state) => state.suppliers);
  	const { products, loading: productsLoading } = useSelector((state) => state.products);

	useEffect(() => {
		dispatch(fetchSuppliers());
		dispatch(fetchProducts());
	}, [dispatch]);

	if (suppliersLoading || productsLoading) {
		return <div>Завантаження...</div>;
	}

	const preparedInitialData = {
		...initialData,
		arrivalDate: initialData?.arrivalDate 
		  ? dayjs(initialData.arrivalDate, 'DD-MM-YYYY').format('YYYY-MM-DD') 
		  : '',
	  };


  return (
    <Formik
		initialValues={{
			registerNumber: preparedInitialData?.registerNumber || '',
			arrivalDate: preparedInitialData?.arrivalDate || '',
			supplierTitle: preparedInitialData?.supplierTitle || '',
			productTitle: preparedInitialData?.productTitle || '',
			weedImpurityBase: preparedInitialData?.weedImpurityBase || '',
			moistureBase: preparedInitialData?.moistureBase || '',
		}}
		validationSchema={getValidationSchema(isEditing)}
		onSubmit={(values) => {
		  onSubmit(values);
		}}
    >
 			{({ errors, touched, values, setFieldValue }) => (
				  <Form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
					<div>
						<label>Номер Реєстра:</label>
						<Field name="registerNumber" as={Input} />
						{errors.registerNumber && touched.registerNumber && <div>{errors.registerNumber}</div>}
					</div>

					{!isEditing && (
						<div>
							<label>Дата:</label>
							<Field 
								name="arrivalDate" 
								type="date"
								as={Input}
								value={values.arrivalDate ? dayjs(values.arrivalDate).format('YYYY-MM-DD') : ''}
							/>
							{errors.arrivalDate && touched.arrivalDate && <div>{errors.arrivalDate}</div>}
						</div>
					)}
					{!isEditing && (
						<>
						<div>
							<label>Постачальник:</label>
						</div>
						<div>
							<Select
								value={values.supplierTitle}
								onChange={(value) => setFieldValue('supplierTitle', value)}
								style={{ width: '100%' }} 
								>
								{suppliers.map((supplier) => (
									<Option key={supplier.id} value={supplier.title}>
										{supplier.title}
									</Option>
								))}
							</Select>
							{errors.supplier && touched.supplier && <div>{errors.supplierTitle}</div>}
						</div>
						</>
					)}
					{!isEditing && (
						<>
							<div>
								<label>Продукція:</label>
							</div>
							<div>
								<Select
									value={values.productTitle}
									onChange={(value) => setFieldValue('productTitle', value)}
									style={{ width: '100%' }} 
									>
									{products.map((product) => (
										<Option key={product.id} value={product.title}>
										{product.title}
										</Option>
									))}
								</Select>
								{errors.product && touched.product && <div>{errors.productTitle}</div>}
							</div>
						</>
					)}

					<div>
						<label>Базова засміченність:</label>
						<Field name="weedImpurityBase" as={Input} />
						{errors.weedImpurityBase && touched.weedImpurityBase && <div>{errors.weedImpurityBase}</div>}
					</div>
					
					<div>
						<label>Базова вологість:</label>
						<Field name="moistureBase" as={Input} />
						{errors.moistureBase && touched.moistureBase && <div>{errors.moistureBase}</div>}
					</div>

					<div style={{ marginTop: '16px' }}>
						<Button className="action-button" htmlType="submit" style={{ marginRight: '8px' }}>
							Зберегти
						</Button>
						<Button onClick={onCancel}>
							Скасувати
						</Button>
					</div>
				</Form>

			)}
    </Formik>
  );
};

export default InvoiceRegisterForm;
