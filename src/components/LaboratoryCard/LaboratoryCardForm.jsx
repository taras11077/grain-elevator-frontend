import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const LaboratoryCardSchema = Yup.object().shape({
	labCardNumber: Yup.string().required('Обов’язкове поле'),
    weedImpurity: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
    moisture: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
    grainImpurity: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
    specialNotes: Yup.string(),
});

const LaboratoryCardForm = ({ initialData, onSubmit, onCancel }) => {
	const preparedInitialData = {
		...initialData,
	  };


    return (
        <Formik
            initialValues={{
                labCardNumber: preparedInitialData?.labCardNumber || '',
                weedImpurity: preparedInitialData?.weedImpurity || '',
                moisture: preparedInitialData?.moisture || '',
                grainImpurity: preparedInitialData?.grainImpurity || '',
                specialNotes: preparedInitialData?.specialNotes || '',
            }}
            validationSchema={LaboratoryCardSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values }) => (
                <Form>
                    <div>
                        <label>Номер лабораторної карточки:</label>
                        <Field name="labCardNumber" as={Input} />
						{errors.labCardNumber && touched.labCardNumber && <div>{errors.labCardNumber}</div>}
                    </div>

                    <div>
                        <label>Сміттева домішка:</label>
						<Field name="weedImpurity" type="number" as={Input} />
                        {errors.weedImpurity && touched.weedImpurity && <div>{errors.weedImpurity}</div>}
                    </div>
                    <div>
                        <label>Вологість:</label>
                        <Field name="moisture" type="number" as={Input} />
                        {errors.physicalWeight && touched.physicalWeight && <div>{errors.physicalWeight}</div>}
                    </div>
                    <div>
                        <label>Зернова домішка:</label>
						<Field name="grainImpurity" type="number" as={Input} />
                        {errors.grainImpurity && touched.grainImpurity && <div>{errors.grainImpurity}</div>}
                    </div>
                    <div>
                        <label>Особливі примітки:</label>
                        <Field name="specialNotes" as={Input} />
                        {errors.specialNotes && touched.specialNotes && <div>{errors.specialNotes}</div>}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
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

export default LaboratoryCardForm;