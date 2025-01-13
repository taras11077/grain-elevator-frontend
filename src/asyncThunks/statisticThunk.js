import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Fetch statistic
export const fetchStatistic = createAsyncThunk(
    'statistic/fetchStatistic',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/input-invoice/statistic'); 
            return response.data; 
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || 'Невідома помилка'); 
        }
    }
);