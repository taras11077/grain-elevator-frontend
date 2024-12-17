import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchInvoices = createAsyncThunk(
	'inputInvoice/fetchInvoices',
	async (params, { getState }) => {
	  const { filters, pagination, sort  } = getState().inputInvoice;

	  const response = await api.get('/input-invoice/search', {
		params: {
		  ...filters,
		  page: pagination.current,
		  size: pagination.pageSize,
		  sortField: sort.sortField, // поле сортування
          sortOrder: sort.sortOrder,// порядок сортування
		},
	  });
  
	  return {
		data: response.data,
		total: parseInt(response.headers['x-total-count'], 10) || 0,
	  };
	}
  );
  
  export const createInvoice = createAsyncThunk(
	'inputInvoice/createInvoice',
	async (formData) => {
	  await api.post('/input-invoice', formData);
	}
  );
  
  export const updateInvoice = createAsyncThunk(
	'inputInvoice/updateInvoice',

	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/input-invoice/${id}`, updates);
		  return response.data; // успішний результат
		} catch (error) {
		  if (error.response && error.response.data) {
			//повернення помилки, щоб обробити її в catch або rejected case
			return rejectWithValue(error.response.data);
		  }
		  throw error; // для інших випадків
		}
	  }
  );
  
  export const deleteInvoice = createAsyncThunk(
	'inputInvoice/deleteInvoice',
	async (id) => {
	  await api.patch(`/input-invoice/${id}/soft-remove`);
	  return id; 
	}
  );