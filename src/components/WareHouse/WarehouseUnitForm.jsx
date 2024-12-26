import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const WarehouseUnitSchema = Yup.object().shape({
    supplierTitle: Yup.string().required('Обов’язкове поле'),
    productTitle: Yup.string().required('Обов’язкове поле'),
});

const WarehouseUnitForm = ({ initialData, onSubmit, onCancel }) => {

	return (
        <Formik
            initialValues={{
                supplierTitle: initialData.supplierTitle || '',
                productTitle: initialData.productTitle || '',
            }}
            validationSchema={WarehouseUnitSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values }) => (
                <Form>
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

export default WarehouseUnitForm;