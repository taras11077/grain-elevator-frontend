import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Завантаження всіх категорій продукції
export const fetchProductCategories = createAsyncThunk(
  'productCategories/fetchProductCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/warehouse-product-category');
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Не вдалося завантажити Категорії продукції.');
    }
  }
);