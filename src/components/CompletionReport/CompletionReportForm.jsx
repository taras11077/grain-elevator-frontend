import { Button, Input } from 'antd';
import dayjs from 'dayjs';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { clearSelectedRegisterIds } from '../../slices/completionReportSlice';
import { fetchRegisters } from '../../asyncThunks/invoiceRegisterThunk';

const getValidationSchema = (isEditing) =>
  Yup.object().shape({
    reportNumber: isEditing ? Yup.mixed().notRequired() : Yup.string().required('Обов’язкове поле'),
    reportDate: isEditing ? Yup.mixed().notRequired() : Yup.date().required('Обов’язкове поле'),
  });

const CompletionReportForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedRegisterIds } = useSelector((state) => state.reports);
  const { registers } = useSelector((state) => state.registers || {});

  const preparedInitialData = {
    ...initialData,
    reportDate: initialData?.reportDate
      ? dayjs(initialData.reportDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      : '',
    invoiceRegisters: initialData?.invoiceRegisters || [],
  };

  // Синхронізація реєстрів для Formik
  const selectedRegisters = selectedRegisterIds?.length
    ? registers.filter((register) => selectedRegisterIds.includes(register.id))
    : preparedInitialData.invoiceRegisters;

  useEffect(() => {
    dispatch(fetchRegisters());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{
        reportNumber: preparedInitialData?.reportNumber || '',
        reportDate: preparedInitialData?.reportDate || '',
        invoiceRegisters: selectedRegisters, // Передаємо вибрані реєстри
      }}
      validationSchema={getValidationSchema(isEditing)}
      onSubmit={(values, { resetForm }) => {
        const payload = {
          ...values,
          invoiceRegisterIds: values.invoiceRegisters.map((register) => register.id),
        };
        console.log('Payload для сервера:', payload); 
        onSubmit(payload); // Надсилаємо форму з ID

        resetForm();
        dispatch(clearSelectedRegisterIds());
      }}
    >
      {({ errors, touched, values, resetForm }) => (
        <Form>
 			{!isEditing && (
				<Button
				onClick={() =>
					navigate('/register', { state: { isForCompletionReport: true } })
				}
				style={{ margin: '20px' }}
				>
				Вибрати Реєстри
				</Button>
			)}

			{!isEditing && (
				<div>
					<label>Обрані Реєстри:</label>
					{values.invoiceRegisters && values.invoiceRegisters.length > 0 ? (
					<ul>
						{values.invoiceRegisters.map((register) => (
						<li key={register.id}>
							{register.registerNumber} - {register.supplierTitle} - {register.productTitle}
						</li>
						))}
					</ul>
					) : (
					<p>Реєстри не вибрано.</p>
					)}
				</div>
		  	)}


          <div>
            <label htmlFor="reportNumber">Номер Акта:</label>
            <Field name="reportNumber" as={Input} style={{ marginBottom: '20px' }} />
            {errors.reportNumber && touched.reportNumber && <div>{errors.reportNumber}</div>}
          </div>

          <div>
            <label style={{ marginTop: '20px' }}>Дата складання:</label>
            <Field
              name="reportDate"
              type="date"
              style={{ marginBottom: '20px' }}
              as={Input}
              value={values.reportDate ? dayjs(values.reportDate).format('YYYY-MM-DD') : ''}
            />
            {errors.reportDate && touched.reportDate && <div>{errors.reportDate}</div>}
          </div>

          <div style={{ marginTop: '16px' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              Зберегти
            </Button>
            <Button
              onClick={() => {
				resetForm();
                dispatch(clearSelectedRegisterIds());
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

export default CompletionReportForm;

