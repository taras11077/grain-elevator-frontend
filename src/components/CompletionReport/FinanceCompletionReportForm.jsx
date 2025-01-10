import { Button, Input, Select } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { fetchPriceLists } from '../../asyncThunks/priceListThunk'

const { Option } = Select;

// Валідація форми
const getValidationSchema = () =>
  Yup.object().shape({
    priceListId: Yup.string().required('Оберіть прайс-лист'),
  });


const FinanceCompletionReportForm = ({ report, onCancel, onSubmit }) => {
	const dispatch = useDispatch();
	const { priceLists, loading: priceListsLoading } = useSelector((state) => state.priceLists);
  
	useEffect(() => {
	  dispatch(fetchPriceLists());
	}, [dispatch]);
  
	if (priceListsLoading) {
	  return <div>Завантаження...</div>;
	}
  
	return (
	  <Formik
		initialValues={{
		  priceListId: '',
		  reportId: report?.id || '',
		}}
		validationSchema={getValidationSchema()}
		onSubmit={(values, { resetForm }) => {
		  const payload = {
			id: values.reportId,
			priceListId: values.priceListId,
		  };
		  onSubmit(payload);
		  resetForm();
		}}
	  >
		{({ values, errors, touched, setFieldValue }) => (
		  <Form>
			<div>
			  <label>Номер Акта:</label>
			  <Input value={report?.reportNumber || ''} disabled />
			</div>
  
			<div>
			  <label>Постачальник:</label>
			  <Input value={report?.supplierTitle || ''} disabled />
			</div>
  
			<div>
			  <label>Продукція:</label>
			  <Input value={report?.productTitle || ''} disabled />
			</div>
  
			<div>
			  <label>Загальна кількість доробленої продукції, т:</label>
			  <Input
				value={
				  report?.physicalWeightReport ? report.physicalWeightReport.toFixed(3) : '0.000'
				}
				disabled
			  />
			</div>
  
			<div>
			  <label>Загальна кількість сушки, т * %:</label>
			  <Input
				value={
				  report?.quantitiesDryingReport ? report.quantitiesDryingReport.toFixed(3) : '0.000'
				}
				disabled
			  />
			</div>
  
			<div>
			  <label>Оберіть прайс-лист:</label>
			  <Select
				style={{ width: '100%' }}
				onChange={(value) => setFieldValue('priceListId', value)}
				value={values.priceListId}
			  >
				{priceLists.map((priceList) => (
				  <Select.Option key={priceList.id} value={priceList.id}>
					{priceList.productTitle}
				  </Select.Option>
				))}
			  </Select>
			  {errors.priceListId && touched.priceListId && (
				<div style={{ color: 'red' }}>{errors.priceListId}</div>
			  )}
			</div>
  
			<div style={{ marginTop: '16px' }}>
			  <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
				Розрахувати
			  </Button>
			  <Button onClick={onCancel}>Скасувати</Button>
			</div>
		  </Form>
		)}
	  </Formik>
	);
  };
  
  export default FinanceCompletionReportForm;
  