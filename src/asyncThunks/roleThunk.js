import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'

// Fetch roles
export const fetchRoles = createAsyncThunk(
	'roles/fetchRoles',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().roles;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/role/search',{params });
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

  // Create Role
  export const createRole = createAsyncThunk(
	'roles/createRole',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/role', formData);
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
  
  // Update Role
  export const updateRole = createAsyncThunk(
	'roles/updateRole',
	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/role/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete Role
  export const deleteRole = createAsyncThunk(
		'roles/deleteRole',
		async (id, { rejectWithValue }) => {
			try {
				const response = await api.patch(`/role/${id}/soft-remove`);
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
					message: data.message || 'Сталася помилка під час видалення Ролі.',
					status,
				});
				}
				// Для всіх інших помилок
				return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
			}
		}
  );

