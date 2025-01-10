import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'


// Fetch Products
export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().products;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/product/search',{params });
		return {
			data: response.data,
			total: response.headers['x-total-count']
			  ? parseInt(response.headers['x-total-count'], 10)
			  : 0,
		  };
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  return rejectWithValue(error.message || 'Невідома помилка');
		}
	  }
	);

  // Create Product
  export const createProduct = createAsyncThunk(
	'products/createProduct',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/product', formData);
		return response.data; // успішний результат
	  } catch (error) {
		if (error.response && error.response.data) {
		  //повернення помилки для обробки в catch або rejected case
		  return rejectWithValue(error.response.data);
		}
		throw error; // для інших випадків
	  }
	}
  );
  
  // Update Product
  export const updateProduct = createAsyncThunk(
	'products/updateProduct',
	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/product/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete Product
  export const deleteProduct = createAsyncThunk(
		'products/deleteProduct',
		async (id, { rejectWithValue }) => {
			try {
				const response = await api.patch(`/product/${id}/soft-remove`);
				return response.data;
			} catch (error) {
				if (error.response) {
				const { status, data } = error.response;
				// Обробка конкретних помилок
				if (status === 401) {
					return rejectWithValue({ message: data.message || 'Ви не авторизовані.', status });
				}
				if (status === 400) {
					return rejectWithValue({ message: data.message || 'Невірні дані форми.', status });
				}
				// Загальна помилка
				return rejectWithValue({
					message: data.message || 'Сталася помилка під час видалення Продукції.',
					status,
				});
				}
				// Для всіх інших помилок
				return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
			}
		}
  );

