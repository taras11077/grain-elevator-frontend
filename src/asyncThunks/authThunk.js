import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'
import { getToken, removeToken, setToken } from '../utils/tokenHelperFunctions'
import { message } from 'antd';

// Login
export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
	try {
		const response = await api.post("/auth/login", payload);
		setToken(response.data.token);
		return response.data;
	} catch (error) {
		console.error('Login error:', error);
		const errorMessage = error.response?.data?.message || 'Неправильний логін або пароль.';
		message.error({
			content: errorMessage,
			duration: 3, 
		  });
		return rejectWithValue(errorMessage);
	}
  });
  
  // Registration
  export const registration = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
	try {
	  console.log(payload);
	  const response = await api.post("/auth/register", payload);
	  message.success('Реєстрація успішна!');
	  return response.data;
	} catch (error) {
	  console.error('Registration error:', error);
	  const errorMessage = error.response?.data?.message || 'Помилка реєстрації.';
	  message.error({
		content: errorMessage,
		duration: 3, 
	  });
	  return rejectWithValue(errorMessage);
	}
  });
  
  // Fetch User Data
  export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { rejectWithValue }) => {
	try {
	  const token = getToken();
	  api.defaults.headers.Authorization = `Bearer ${token}`;
	  const response = await api.get("/employee/user-info");
	  return { ...response.data, token };
	} catch (error) {
	  console.error('Failed to fetch user data:', error);
	  removeToken();
	  const errorMessage = error.response?.data?.message || 'Не вдалося отримати дані користувача.';
	  message.error({
		content: errorMessage,
		duration: 3, 
	  });
	  return rejectWithValue(errorMessage);
	}
  });
  
  // Logout
  export const logout = createAsyncThunk('auth/logout', async ({ id }, { dispatch, rejectWithValue }) => {
	try {
	  await dispatch(updateLastSeenOnline({ id })).unwrap();
	  removeToken();
	  message.success('Ви успішно вийшли з системи.');
	} catch (error) {
	  console.error('Failed to logout:', error);
	  const errorMessage = error.response?.data?.message || 'Помилка під час виходу.';
	  message.error({
		content: errorMessage,
		duration: 3, 
	  });
	  return rejectWithValue(errorMessage);
	}
  });
  
  // Update Last Seen Online
  export const updateLastSeenOnline = createAsyncThunk(
	'auth/updateLastSeenOnline',
	async ({ id }, { rejectWithValue }) => {
	  try {
		const response = await api.put(`/employee/${id}/last-seen-online`);
		return response.data;
	  } catch (error) {
		console.error('Failed to update last seen online:', error);
		const errorMessage = error.response?.data?.message || 'Помилка оновлення статусу.';
		message.error(errorMessage);
		return rejectWithValue(errorMessage);
	  }
	}
  );




