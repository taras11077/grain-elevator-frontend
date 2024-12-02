import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import {getToken, removeToken, setToken} from '../utils/helperFunctions'; 

export const login = createAsyncThunk('auth/login', async (payload) => {
	const response = await api.post("/login", payload);
	setToken(response.data.token);
	return response.data;
});


export const registration = createAsyncThunk('auth/login', async (payload) => {
	const response = await api.post("/register", payload);
	return response.data;
});



export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (payload) => {
	try {
		const token = getToken();
		api.defaults.headers.Authorization = `Bearer ${token}`;
		const response = await api.get("/user");
		return {...response.data, token};
	} catch (err) {
		removeToken();
	}	
});

export const logout = createAsyncThunk('auth/logout', async () => {
	removeToken();
});


