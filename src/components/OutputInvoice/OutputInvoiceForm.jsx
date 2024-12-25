import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const OutputInvoiceSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required('Обов’язкове поле'),
    shipmentDate: Yup.date().required('Обов’язкове поле'),
    vehicleNumber: Yup.string().required('Обов’язкове поле'),
    supplierTitle: Yup.string().required('Обов’язкове поле'),
    productTitle: Yup.string().required('Обов’язкове поле'),
	productCategory: Yup.string().required('Обов’язкове поле'),
	productWeight: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
});

const OutputInvoiceForm = ({ initialData, onSubmit, onCancel }) => {
	const preparedInitialData = {
		...initialData,
		arrivalDate: initialData?.arrivalDate 
		  ? dayjs(initialData.arrivalDate, 'DD-MM-YYYY').format('YYYY-MM-DD') 
		  : '',
	  };


    return (
        <Formik
            initialValues={{
                invoiceNumber: preparedInitialData?.invoiceNumber || '',
                arrivalDate: preparedInitialData?.arrivalDate || '',
                vehicleNumber: preparedInitialData?.vehicleNumber || '',
                physicalWeight: preparedInitialData?.physicalWeight || '',
                supplierTitle: preparedInitialData?.supplierTitle || '',
                productTitle: preparedInitialData?.productTitle || '',
            }}
            validationSchema={OutputInvoiceSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values }) => (
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
							value={values.arrivalDate ? dayjs(values.arrivalDate).format('YYYY-MM-DD') : ''}
						 />
                        {errors.arrivalDate && touched.arrivalDate && <div>{errors.arrivalDate}</div>}
                    </div>
                    <div>
                        <label>Номер транспортного засобу:</label>
                        <Field name="vehicleNumber" as={Input} />
                        {errors.vehicleNumber && touched.vehicleNumber && <div>{errors.vehicleNumber}</div>}
                    </div>
                    <div>
                        <label>Постачальник:</label>
                        <Field name="supplierTitle" as={Input} />
                        {errors.supplier && touched.supplier && <div>{errors.supplierTitle}</div>}
                    </div>
                    <div>
                        <label>Продукція:</label>
                        <Field name="productTitle" as={Input} />
                        {errors.product && touched.product && <div>{errors.productTitle}</div>}
                    </div>

					<div>
                        <label>Категорія продукції:</label>
                        <Field name="productCategory" as={Input} />
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