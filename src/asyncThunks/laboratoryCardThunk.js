import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch Laboratory Cards
export const fetchLaboratoryCards = createAsyncThunk(
  'laboratoryCards/fetchLaboratoryCards',
  async (_, { getState }) => {
    const { pagination, filters, sort } = getState().laboratoryCards;
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...filters,
      sortField: sort?.sortField,
      sortOrder: sort?.sortOrder,
    };
    const response = await api.get('/laboratory-card/search', { params });
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'], 10) || 0,
    };
  }
);

// Create Laboratory Card
export const createLaboratoryCard = createAsyncThunk(
  'laboratoryCards/createLaboratoryCard',
  async (payload) => {
    const response = await api.post('/laboratory-card', payload);
    return response.data;
  }
);

// Update Laboratory Card
export const updateLaboratoryCard = createAsyncThunk(
  'laboratoryCards/updateLaboratoryCard',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratory-card/${id}`, updates);
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

// Delete Laboratory Card
export const deleteLaboratoryCard = createAsyncThunk(
  'laboratoryCards/deleteLaboratoryCard',
  async (id) => {
	await api.patch(`/laboratory-card/${id}/soft-remove`);
    return id;
  }
);
