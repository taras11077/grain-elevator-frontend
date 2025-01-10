import { Button, Input } from 'antd'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const SupplierSchema = Yup.object().shape({
    title: Yup.string().required('Обов’язкове поле'),
});

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {

    return (
        <Formik
            initialValues={{
                title: initialData?.title || '',
            }}
            validationSchema={SupplierSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values }) => (
                <Form>
                    <div>
                        <label>Постачальник:</label>
                        <Field name="title" as={Input} />
                        {errors.title && touched.title && <div>{errors.title}</div>}
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

export default SupplierForm;