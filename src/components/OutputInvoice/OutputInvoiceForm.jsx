import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

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
						<Field name="supplierTitle" as={Input} disabled={isEditing || isFromWarehouse}/>
						{errors.supplier && touched.supplier && <div>{errors.supplierTitle}</div>}
					</div>

					<div>
						<label>Продукція:</label>
						<Field name="productTitle" as={Input} disabled={isEditing || isFromWarehouse}/>
						{errors.product && touched.product && <div>{errors.productTitle}</div>}
					</div>

					<div>
						<label>Категорія продукції:</label>
						<Field name="productCategory" as={Input} disabled={isEditing || isFromWarehouse}/>
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