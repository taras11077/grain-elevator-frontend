import { Button, Input } from 'antd';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const WarehouseUnitSchema = Yup.object().shape({
  supplierTitle: Yup.string().required('Обов’язкове поле'),
  productTitle: Yup.string().required('Обов’язкове поле'),
});

const WarehouseUnitForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const preparedInitialData = {
    supplierTitle: initialData.supplierTitle || '',
    productTitle: initialData.productTitle || '',
    productCategories: initialData.productCategories || [],
  };

  return (
    <Formik
      initialValues={preparedInitialData}
      validationSchema={WarehouseUnitSchema}
      onSubmit={onSubmit}
      enableReinitialize={true} // Оновлює форму, якщо initialData змінюється
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <label>Постачальник:</label>
            <Field name="supplierTitle" as={Input} />
            {errors.supplierTitle && touched.supplierTitle && (
              <div style={{ color: 'red' }}>{errors.supplierTitle}</div>
            )}
          </div>
          <div>
            <label>Продукція:</label>
            <Field name="productTitle" as={Input} />
            {errors.productTitle && touched.productTitle && (
              <div style={{ color: 'red' }}>{errors.productTitle}</div>
            )}
          </div>
          <div>
            <label>Категорії продукції:</label>
            {preparedInitialData.productCategories.map((category, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <Input value={category.title} readOnly style={{ marginRight: '8px' }} />
                <Field
                  name={`productCategories[${index}].value`}
                  as={Input}
                  type="number"
                  placeholder="Значення"
                />
              </div>
            ))}
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
