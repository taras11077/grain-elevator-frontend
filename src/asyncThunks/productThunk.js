import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/product');
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Не вдалося завантажити Продукти.');
    }
  }
);
