import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch Input invoices
export const fetchInvoices = createAsyncThunk(
	'inputInvoice/fetchInvoices',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().inputInvoice;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/input-invoice/search',{params });
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

  // Create Input invoice
  export const createInvoice = createAsyncThunk(
	'inputInvoice/createInvoice',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/input-invoice', formData);
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
  
  // Update Input invoice
  export const updateInvoice = createAsyncThunk(
	'inputInvoice/updateInvoice',

	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/input-invoice/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete Input invoice
  export const deleteInvoice = createAsyncThunk(
	'inputInvoice/deleteInvoice',
	async (id) => {
	  await api.patch(`/input-invoice/${id}/soft-remove`);
	  return id; 
	}
  );