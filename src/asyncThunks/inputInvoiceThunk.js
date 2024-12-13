import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchInvoices = createAsyncThunk(
	'inputInvoice/fetchInvoices',
	async (params, { getState }) => {
	  const { filters, pagination } = getState().inputInvoice;

	  const response = await api.get('/input-invoice/search', {
		params: {
		  ...filters,
		  page: pagination.current,
		  size: pagination.pageSize,
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
	async ({ id, formData }) => {
	  await api.put(`/input-invoice/${id}`, formData);
	}
  );
  
  export const deleteInvoice = createAsyncThunk(
	'inputInvoice/deleteInvoice',
	async (id) => {
	  await api.patch(`/input-invoice/${id}/soft-remove`);
	  return id; 
	}
  );