import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

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

export const fetchTimelineStatistic = createAsyncThunk(
    'statistic/fetchTimelineStatistic',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/input-invoice/timeline-statistic');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Не вдалося отримати статистику по часу.');
        }
    }
);