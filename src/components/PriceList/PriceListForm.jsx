import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const PriceListSchema = Yup.object().shape({
    productTitle: Yup.string().required('Обов’язкове поле'),
});

const PriceListForm = ({ initialData, onSubmit, onCancel }) => {

    return (
        <Formik
            initialValues={{
                productTitle: initialData?.productTitle || '',
            }}
            validationSchema={PriceListSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values }) => (
                <Form>
                    <div>
                        <label>Назва прайс-листа:</label>
                        <Field name="productTitle" as={Input} />
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

export default PriceListForm;