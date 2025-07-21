import { Button, Modal, Typography, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	createProduct,
	deleteProduct,
	fetchProducts,
	updateProduct
} from '../asyncThunks/productThunk'
import ProductFilterFields from '../components/Product/ProductFilterFields'
import ProductForm from '../components/Product/ProductForm'
import ProductTable from '../components/Product/ProductTable'
import { setFilters, setPagination, setSelectedProduct, setSort, toggleModal } from '../slices/productSlice'
import './InputInvoicePage.css'
import './ProductPage.css'

const ProductPage = () => {
	const { Title } = Typography;
	const dispatch = useDispatch();

	 // Стан із Redux
	 const { 
		products, 
		loading, 
		pagination, 
		filters, 
		isModalOpen, 
		selectedProduct, 
	  } = useSelector((state) => state.products);
  
	// Завантаження Продукції
	useEffect(() => {
		dispatch(fetchProducts());
	  }, [dispatch, filters, pagination.current, pagination.pageSize]);
  
	// Обробка фільтрів
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		dispatch(setFilters({ [name]: value }));
	};

	// Обробка змін у таблиці (пагінація, сортування)
	const handleTableChange = (pagination, _, sorter) => {
		const sortField = sorter?.field || null;
		const sortOrder = sorter?.order === 'ascend' ? 'asc' : 'desc';
		dispatch(setSort({ sortField, sortOrder }));
		dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
		dispatch(fetchProducts());
	  };
	
	  // Відкрити модальне вікно для створення/редагування Продукції
	  const handleOpenModal = (operation = null) => {
		dispatch(setSelectedProduct(operation));
		dispatch(toggleModal(true));
	  };
	
	  // Закрити модальне вікно
	  const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setSelectedProduct(null));
	  };
	
	  // Додавання чи оновлення Продукції
	  const handleFormSubmit = async (formData) => {
		try {
		  if (selectedProduct) {
				const resultAction = await dispatch(updateProduct({ id: selectedProduct.id, updates: formData })).unwrap();
			  	message.success(`Продукцію з ID ${resultAction.id} успішно оновлено.`);
		  } else {
				const resultAction = await dispatch(createProduct(formData)).unwrap();
				message.success(`Продукцію з ID ${resultAction.id} успішно створено.`);
		  }
		  dispatch(fetchProducts());
		  handleCloseModal();
		} catch (error) {
			handleError(error);
		}
	  };
	
	  // Видалення Продукції
	  const handleDeleteProduct = async (record) => {
		let deletedProduct = null;
		try {
		  deletedProduct = await dispatch(deleteProduct(record.id)).unwrap();
		  message.success(`Продукцію ${deletedProduct.title} успішно видалено!`);
		  dispatch(fetchProducts());
		} catch (error) {
			handleError(error);
		};
	  }

	  // Обробка помилок
		const handleError = (error) => {
			if (error.status === 401) {
			message.error(error.message || 'Ви не авторизовані.');
			} else if(error.status === 404) {
				message.error(error.message || `Таку Продукцію не знайдено.`);
			} else if (error.status === 400) {
				message.error(error.message || 'Помилка: невірні дані форми.');
			} else if (error.status === 500) {
				message.error(error.message || 'Внутрішня помилка сервера. Спробуйте пізніше.');
			} else {
				message.error(error.message || 'Сталася помилка.');
			}
			console.error('Помилка:', error);
		};

	  return (
		<div className="container container-slim">
		  	 <Title level={1} className="page-title">
			  	Найменування продукції
			</Title>

			<Title level={4} className="page-subtitle">
				поставленої на підприємство за останній звітний період.
			</Title>
	
			<ProductFilterFields filters={filters} onFilterChange={handleFilterChange} />
		
			<Button 
			className="action-button"
			onClick={() => handleOpenModal(null)} 
			>
				Створити Продукцію
			</Button>
		
			<ProductTable
				products={products}
				loading={loading}
				pagination={pagination}
				onTableChange={handleTableChange}
				handleOpenModal={handleOpenModal}
				handleDeleteProduct={handleDeleteProduct}
			/>

			<Modal
				title={selectedProduct ? 'Редагувати Продукцію' : 'Створити Продукцію'}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={null}
			>
				<ProductForm
				key={selectedProduct ? selectedProduct.id : 'new'}
				initialData={selectedProduct || {}}
				onSubmit={handleFormSubmit}
				onCancel={handleCloseModal}
				isEditing={!!selectedProduct}
				/>
			</Modal>
		</div>
	  );
	};
	
	export default ProductPage;
	