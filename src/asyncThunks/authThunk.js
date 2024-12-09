import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'
import { removeToken, setToken } from '../utils/tokenHelperFunctions'

export const login = createAsyncThunk('auth/login', async (payload) => {
	const response = await api.post("/auth/login", payload);
	setToken(response.data.token);
	return response.data;
});

export const registration = createAsyncThunk('auth/register', async (payload) => {
	console.log(payload);
	const response = await api.post("/auth/register", payload);
	return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
	removeToken();
});


