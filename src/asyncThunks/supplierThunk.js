import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'

// Завантаження всіх постачальників
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/supplier');
      return response.data; // Повертаємо масив постачальників
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Не вдалося завантажити постачальників.');
    }
  }
);
