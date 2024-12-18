import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch Laboratory Cards
export const fetchLaboratoryCards = createAsyncThunk(
	'laboratoryCards/fetchLaboratoryCards',
	async (_, { getState, rejectWithValue }) => {
	  const { pagination, filters, sort } = getState().laboratoryCards;
  
	  const params = {
		...filters,
		page: pagination.current,
		size: pagination.pageSize,
		sortField: sort.sortField, // поле сортування
		sortOrder: sort.sortOrder,// порядок сортування
	  }
  
	  try {
		const response = await api.get('/laboratory-card/search',{params });
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

// Create Laboratory Card
export const createLaboratoryCard = createAsyncThunk(
	'laboratoryCards/createLaboratoryCard',
	async (payload, { rejectWithValue }) => {
	  try {
		const response = await api.post('/laboratory-card', payload); 
		return response.data; 
	  } catch (error) {
		if (error.response && error.response.data) {
		  // якщо сервер повертає помилку, передаємо її
		  return rejectWithValue(error.response.data);
		}
		// якщо це інший тип помилки, повертаємо узагальнене повідомлення
		return rejectWithValue(error.message || 'Не вдалося створити лабораторну карточку.');
	  }
	}
  );

// Update Laboratory Card
export const updateLaboratoryCard = createAsyncThunk(
  'laboratoryCards/updateLaboratoryCard',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratory-card/${id}`, updates);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error; 
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
