import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const InputInvoiceSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required('Обов’язкове поле'),
    arrivalDate: Yup.date().required('Обов’язкове поле'),
    vehicleNumber: Yup.string().required('Обов’язкове поле'),
    physicalWeight: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
    supplierTitle: Yup.string().required('Обов’язкове поле'),
    productTitle: Yup.string().required('Обов’язкове поле'),
});

const InputInvoiceForm = ({ initialData, onSubmit, onCancel }) => {
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
            validationSchema={InputInvoiceSchema}
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
                        <label>Дата:</label>
                        <Field 
							name="arrivalDate" 
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
                        <label>Вага:</label>
                        <Field name="physicalWeight" type="number" as={Input} />
                        {errors.physicalWeight && touched.physicalWeight && <div>{errors.physicalWeight}</div>}
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

export default InputInvoiceForm;





// const InputInvoiceForm = ({ invoice, onSave, onCancel }) => {
//     const [formData, setFormData] = useState(invoice || {});

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = () => {
//         onSave(formData);
//     };

//     return (
//         <>
//             <input 
// 				type="text"
//                 name="invoiceNumber" 
// 				placeholder="Номер накладної"
//                 value={formData.invoiceNumber || ''} 
//                 onChange={handleChange} 
//             />
// 			<input
//                 type="date"
//                 name="arrivalDate"
//                 placeholder="Дата прибуття"
//                 value={formData.arrivalDate || ''}
//                 onChange={handleChange}
//             />
//             <input
//                 type="text"
//                 name="vehicleNumber"
//                 placeholder="Номер транспорту"
//                 value={formData.vehicleNumber || ''}
//                 onChange={handleChange}
//             />
//             <input
//                 type="number"
//                 name="physicalWeight"
//                 placeholder="Фізична вага"
//                 value={formData.physicalWeight || ''}
//                 onChange={handleChange}
//             />
			 
// 			<input
//                 type="text"
//                 name="productTitle"
//                 placeholder="Продукція"
//                 value={formData.productTitle || ''}
//                 onChange={handleChange}
//             />
// 			<input
//                 type="text"
//                 name="supplierTitle"
//                 placeholder="Постачальник"
//                 value={formData.supplierTitle || ''}
//                 onChange={handleChange}
//             />

//             <button onClick={handleSubmit}>Save</button>
//             <button onClick={onCancel}>Cancel</button>
//         </>
//     );
// };

//export default InputInvoiceForm;

