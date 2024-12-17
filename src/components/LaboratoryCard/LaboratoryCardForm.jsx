import { Button, Checkbox, Input } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { clearSelectedInvoice, setSelectedInvoice } from '../../slices/inputInvoiceSlice'

const LaboratoryCardSchema = Yup.object().shape({
  LabCardNumber: Yup.string().required('Обов’язкове поле'),
  WeedImpurity: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
  Moisture: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
  GrainImpurity: Yup.number().required('Обов’язкове поле').positive('Має бути додатнім'),
  SpecialNotes: Yup.string(),
  IsProduction: Yup.boolean(),
});

const LaboratoryCardForm = ({ initialData, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedInvoice = useSelector((state) => state.inputInvoice.selectedInvoice);

   // Якщо накладну вибрано на сторінці, оновлюємо Redux-стан
   useEffect(() => {
    if (location.state?.selectedInvoice) {
      dispatch(setSelectedInvoice(location.state.selectedInvoice)); // Оновлення Redux-стану
      navigate(location.pathname, { replace: true }); // Очищення location.state
    }
  }, [location, navigate, dispatch]);

  return (
    <Formik
      initialValues={{
        LabCardNumber: initialData?.labCardNumber || '',
        WeedImpurity: initialData?.weedImpurity || '',
        Moisture: initialData?.moisture || '',
        GrainImpurity: initialData?.grainImpurity || '',
        SpecialNotes: initialData?.specialNotes || '',
		IsProduction: initialData?.isProduction || false,
      }}
      validationSchema={LaboratoryCardSchema}
	  onSubmit={(values, { resetForm }) => {
        const formData = { ...values, InputInvoiceId: selectedInvoice?.id };
        onSubmit(formData); // Відправка даних

        resetForm(); // Очищення форми
        dispatch(clearSelectedInvoice()); // Очищення вибраної накладної у Redux
	}}
    >
      {({ errors, touched, resetForm }) => (
        <Form>
			{/* Використовуємо initialData для визначення режиму */}
			{!initialData && (
				<div style={{ marginBottom: 20 }}>
				<label style={{ marginRight: 20 }}>Прибуткова накладна:</label>

				{selectedInvoice ? (
					` №${selectedInvoice.invoiceNumber}`
				) : (
					<Button
					style={{ width: '30%' }}
					onClick={() =>
						navigate('/input-invoices', {
						state: { isForLabCard: true }, // Передаємо прапорець
						})
					}
					>
					Вибрати накладну
					</Button>
				)}
				</div>
          )}

          <div>
            <label>Номер лабораторної карточки:</label>
            <Field name="LabCardNumber" as={Input} />
            {errors.labCardNumber && touched.labCardNumber && <div>{errors.labCardNumber}</div>}
          </div>

          <div>
            <label>Сміттева домішка:</label>
            <Field name="WeedImpurity" type="number" as={Input} />
            {errors.weedImpurity && touched.weedImpurity && <div>{errors.weedImpurity}</div>}
          </div>

          <div>
            <label>Вологість:</label>
            <Field name="Moisture" type="number" as={Input} />
            {errors.moisture && touched.moisture && <div>{errors.moisture}</div>}
          </div>

          <div>
            <label>Зернова домішка:</label>
            <Field name="GrainImpurity" type="number" as={Input} />
            {errors.grainImpurity && touched.grainImpurity && <div>{errors.grainImpurity}</div>}
          </div>

          <div>
            <label>Особливі примітки:</label>
            <Field name="SpecialNotes" as={Input} />
            {errors.specialNotes && touched.specialNotes && <div>{errors.specialNotes}</div>}
          </div>

		  <div>
				<Field name="IsProduction">
					{({ field, form }) => (
					<Checkbox
						{...field}
						checked={field.value} // Значення чекбокса
						onChange={(e) => form.setFieldValue('IsProduction', e.target.checked)} // Оновлення значення
					>
						Допуск до виробництва
					</Checkbox>
					)}
				</Field>
		</div>

          <div style={{ marginTop: '16px' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              Зберегти
            </Button>
            <Button
              onClick={() => {
				resetForm(); // Очищення форми
				dispatch(clearSelectedInvoice()); // Очищення вибраної накладної у Redux
                onCancel(); 
              }}
            >
              Скасувати
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LaboratoryCardForm;
