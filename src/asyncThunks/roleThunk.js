import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await api.get('/role'); 
  return response.data; 
});
