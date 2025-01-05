import { Button, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers } from '../../asyncThunks/supplierThunk';
import { fetchProducts } from '../../asyncThunks/productThunk';
import { fetchProductCategories } from '../../asyncThunks/productCategoryThunk';

const { Option } = Select;

const OutputInvoiceSchema = (isEditing , isFromWarehouse) => Yup.object().shape({
    invoiceNumber: Yup.string().required('Обов’язкове поле'),
    shipmentDate: Yup.date().required('Обов’язкове поле'),
    vehicleNumber: Yup.string().required('Обов’язкове поле'),
    supplierTitle: isEditing || isFromWarehouse ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
    productTitle: isEditing || isFromWarehouse ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
	productCategory: isEditing || isFromWarehouse ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
	productWeight: isEditing || isFromWarehouse ? Yup.mixed().notRequired() : Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
});

const OutputInvoiceForm = ({ initialData = {}, onSubmit, onCancel, isEditing, isFromWarehouse  }) => {
	const dispatch = useDispatch();
	const { suppliers, loading: suppliersLoading } = useSelector((state) => state.suppliers);
  	const { products, loading: productsLoading } = useSelector((state) => state.products);
	const { productCategories, loading: productCategoriesLoading } = useSelector((state) => state.productCategories);

	useEffect(() => {
		dispatch(fetchSuppliers());
		dispatch(fetchProducts());
		dispatch(fetchProductCategories());
	}, [dispatch]);

	if (suppliersLoading || productsLoading || productCategoriesLoading) {
		return <div>Завантаження...</div>;
	}
  
	const preparedInitialData = {
		...initialData,
		shipmentDate: initialData?.shipmentDate 
		  ? dayjs(initialData.shipmentDate, 'DD-MM-YYYY').format('YYYY-MM-DD') 
		  : '',
	  };

    return (
        <Formik
            initialValues={{
                invoiceNumber: preparedInitialData?.invoiceNumber || '',
                shipmentDate: preparedInitialData?.shipmentDate || '',
                vehicleNumber: preparedInitialData?.vehicleNumber || '',
				supplierTitle: preparedInitialData?.supplierTitle || '',
                productTitle: preparedInitialData?.productTitle || '',
				productCategory: preparedInitialData?.productCategory || '',
                productWeight: preparedInitialData?.productWeight || '', 
            }}
            validationSchema={OutputInvoiceSchema(isEditing, isFromWarehouse)}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values, setFieldValue }) => (
                <Form>
                    <div>
                        <label>Номер накладної:</label>
                        <Field name="invoiceNumber" as={Input} />
                        {errors.invoiceNumber && touched.invoiceNumber && <div>{errors.invoiceNumber}</div>}
                    </div>
                    <div>
                        <label>Дата відвантаження:</label>
                        <Field 
							name="shipmentDate" 
							type="date"
							as={Input}
							value={values.shipmentDate ? dayjs(values.shipmentDate).format('YYYY-MM-DD') : ''}
						 />
                        {errors.shipmentDate && touched.shipmentDate && <div>{errors.shipmentDate}</div>}
                    </div>
                    <div>
                        <label>Номер транспортного засобу:</label>
                        <Field name="vehicleNumber" as={Input} />
                        {errors.vehicleNumber && touched.vehicleNumber && <div>{errors.vehicleNumber}</div>}
                    </div>

					<div>
						<label>Постачальник:</label>
					</div>
					<div>
						{/* <Field name="supplierTitle" as={Input} disabled={isEditing || isFromWarehouse}/> */}
						<Select
							value={values.supplierTitle}
							onChange={(value) => setFieldValue('supplierTitle', value)}
							disabled={isEditing || isFromWarehouse}
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
							
					<div>
						<label>Продукція:</label>
					</div>
					<div>
						<Select
							value={values.productTitle}
							onChange={(value) => setFieldValue('productTitle', value)}
							disabled={isEditing || isFromWarehouse}
							style={{ width: '100%' }} 
							>
							{products.map((product) => (
								<Option key={product.id} value={product.title}>
								{product.title}
								</Option>
							))}
						</Select>
						{/* <Field name="productTitle" as={Input} disabled={isEditing || isFromWarehouse}/> */}
						{errors.product && touched.product && <div>{errors.productTitle}</div>}
					</div>

					<div>
						<label>Категорія продукції:</label>
					</div>
					<div>
						<Select
							value={values.productCategory}
							onChange={(value) => setFieldValue('productCategory', value)}
							disabled={isEditing || isFromWarehouse}
							style={{ width: '100%' }} 
							>
							{productCategories?.map((category) => (
								<Option key={category.id} value={category.title}>
								{category.title}
								</Option>
							))}
            			</Select>
						{/* <Field name="productCategory" as={Input} disabled={isEditing || isFromWarehouse}/> */}
						{errors.productCategory && touched.productCategory && <div>{errors.productCategory}</div>}
					</div>
			
					<div>
						<label>Вага:</label>
						<Field name="productWeight" type="number" as={Input} />
						{errors.productWeight && touched.productWeight && <div>{errors.productWeight}</div>}
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

export default OutputInvoiceForm;
