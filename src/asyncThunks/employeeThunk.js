import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch employee
export const fetchEmployees = createAsyncThunk(
	'employees/fetchEmployees',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().employees;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/employee/search',{params});
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

  // Create employee
  export const createEmployee = createAsyncThunk(
	'employees/createEmployee',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/employee', formData);
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
  
  // Update employee
  export const updateEmployee = createAsyncThunk(
	'employees/updateEmployee',
	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/employee/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete employee
  export const deleteEmployee = createAsyncThunk(
		'employees/deleteEmployee',
		async (id, { rejectWithValue }) => {
			try {
				const response = await api.patch(`/employee/${id}/soft-remove`);
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
					message: data.message || 'Сталася помилка під час видалення Технологичної операції.',
					status,
				});
				}
				// Для всіх інших помилок
				return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
			}
		}
  );