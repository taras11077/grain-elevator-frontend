import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch Output-invoices
export const fetchInvoices = createAsyncThunk(
	'outputInvoice/fetchInvoices',
	async (_, { getState, rejectWithValue }) => {
		const { filters, pagination, sort  } = getState().outputInvoices;

		const params = {
			...filters,
			page: pagination.current,
			size: pagination.pageSize,
			sortField: sort.sortField, // поле сортування
			sortOrder: sort.sortOrder,// порядок сортування
		  }

	  try {
		const response = await api.get('/output-invoice/search',{params });
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

  // Create Output-invoice
  export const createInvoice = createAsyncThunk(
	'outputInvoice/createInvoice',
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await api.post('/output-invoice', formData);
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
  
  // Update Output-invoice
  export const updateInvoice = createAsyncThunk(
	'outputInvoice/updateInvoice',

	async ({ id, updates }, { rejectWithValue }) => {
		try {
		  const response = await api.put(`/output-invoice/${id}`, updates);
		  return response.data;
		} catch (error) {
		  if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		  }
		  throw error;
		}
	  }
  );
  
  // Delete Output-invoice
  export const deleteInvoice = createAsyncThunk(
	'outputInvoice/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/output-invoice/${id}/soft-remove`);
      return id;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || 'Невідома помилка');
    }
  }
  );