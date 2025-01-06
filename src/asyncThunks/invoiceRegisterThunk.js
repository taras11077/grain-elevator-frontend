import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'


// Fetch Register
export const fetchRegisters = createAsyncThunk(
	'registers/fetchRegisters',
	async (_, { getState, rejectWithValue }) => {
	  const { pagination, filters, sort } = getState().registers;
  
	  const params = {
		...filters,
		page: pagination.current,
		size: pagination.pageSize,
		sortField: sort.sortField, // поле сортування
		sortOrder: sort.sortOrder,// порядок сортування
	  }
  
	  try {
		const response = await api.get('/register/search',{params });
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

// Create Register
export const createRegister = createAsyncThunk(
	'registers/createRegister',
	async (payload, { rejectWithValue }) => {
	  try {
		const response = await api.post('/register', payload);
		return response.data; // Успішна відповідь
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
			message: data.message || 'Сталася помилка під час створення Реєстру.',
			status,
		  });
		}
  
		// Для всіх інших помилок
		return rejectWithValue({ message: error.message || 'Невідома помилка.', status: 500 });
	  }
	}
  );
  
  

// Update Register
export const updateRegister = createAsyncThunk(
	'registers/updateRegister',
	async ({ id, updates }, { rejectWithValue }) => {
	  try {
		const response = await api.put(`/register/${id}`, updates);
		return response.data; // Успішна відповідь
	  } catch (error) {
		if (error.response) {
		  // Обробка помилки на рівні сервера
		  const { status, data } = error.response;
  
		  if (status === 401) {
			return rejectWithValue({ message: data.message || 'Ви не авторизовані.', status });
		  }
		  return rejectWithValue({
			message: data.message || 'Сталася помилка під час оновлення Реєстру.',
			status,
		  });
		}
		// Для всіх інших помилок
		return rejectWithValue({ message: error.message || 'Невідома помилка.', status: 500 });
	  }
	}
  );
  

// Delete Register
export const deleteRegister = createAsyncThunk(
	'registers/deleteRegister',
	async (id, { rejectWithValue }) => {
	  try {
		await api.patch(`/register/${id}/soft-remove`);
		return id; 
	  } catch (error) {
		if (error.response) {
		  // Обробка помилки на рівні сервера
		  const { status, data } = error.response;
  
		  if (status === 401) {
			return rejectWithValue({ message: data.message || 'Ви не авторизовані.', status });
		  }
  
		  return rejectWithValue({
			message: data.message || 'Сталася помилка під час видалення Реєстру.',
			status,
		  });
		}
  
		// Для всіх інших помилок
		return rejectWithValue({ message: error.message || 'Невідома помилка.', status: 500 });
	  }
	}
  );
  