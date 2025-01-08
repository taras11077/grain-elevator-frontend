import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'


// Fetch price-lists
export const fetchPriceLists = createAsyncThunk(
	'priceList/fetchPriceLists',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().priceLists;
		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('price-list/search',{params });
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

  // Create  price-list
  export const createPriceList = createAsyncThunk(
	'priceList/createPriceList',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/price-list', formData);
		return response.data; // успішний результат
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
			message: data.message || 'Сталася помилка під час створення Акта виконаних робіт.',
			status,
		  });
		}
		// Для всіх інших помилок
		return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
	  }
	}
  );
  
  // Update price-list
  export const updatePriceList = createAsyncThunk(
	'priceList/updatePriceList',

	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/price-list/${id}`, updates);
		  return response.data; // Успішна відповідь
		} catch (error) {
		  if (error.response) {
			// Обробка помилки на рівні сервера
			const { status, data } = error.response;
	
			if (status === 400) {
				return rejectWithValue({ message: data.message, status });
			  }

			if (status === 401) {
			  return rejectWithValue({ message: data.message || 'Ви не авторизовані.', status });
			}
	
			return rejectWithValue({
			  message: data.message || 'Сталася помилка під час оновлення Акта виконаних робіт.',
			  status,
			});
		  }
		  // Для всіх інших помилок
		  return rejectWithValue({ message: error.message || 'Невідома помилка.', status: 500 });
		}
	  }
	);
  
  // Delete price-list
  export const deletePriceList = createAsyncThunk(
	'priceList/deletePriceList',
  async (id, { rejectWithValue }) => {
    try {
		const response = await api.patch(`/price-list/${id}/soft-remove`);
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
			message: data.message || 'Сталася помилка під час видалення Складського юніта.',
			status,
		  });
		}
		// Для всіх інших помилок
		return rejectWithValue({ message: error.message || 'Невідома помилка.', status: error.status || 500, });
	  }
	}
  );
  