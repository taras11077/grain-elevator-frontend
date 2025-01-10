import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'

// Fetch suppliers
export const fetchSuppliers = createAsyncThunk(
	'suppliers/fetchSuppliers',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().suppliers;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/supplier/search',{params });
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

  // Create Supplier
  export const createSupplier = createAsyncThunk(
	'suppliers/createSupplier',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/supplier', formData);
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
  
  // Update Supplier
  export const updateSupplier = createAsyncThunk(
	'suppliers/updateSupplier',
	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/supplier/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete Supplier
  export const deleteSupplier = createAsyncThunk(
		'suppliers/deleteSupplier',
		async (id, { rejectWithValue }) => {
			try {
				const response = await api.patch(`/supplier/${id}/soft-remove`);
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
					message: data.message || 'Сталася помилка під час видалення Постачальника.',
					status,
				});
				}
				// Для всіх інших помилок
				return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
			}
		}
  );


